const chai = require('chai');
const chaihttp = require('chai-http');
const server = require('../index');
const POST = require('../videoSchema');
const USER = require('../userSchema');
const { expect } = require("chai")
// const chaiArrays = require('chai-arrays');
// chai.use(chaiArrays)
chai.should();
chai.use(chaihttp)


describe('GET', () => {
    // it('Should get data of all the posts', (done) => {
    //     chai.request(server)
    //         .get('/')
    //         .end((error, response) => {
    //             // response.should.have.status(200);
    //             response.body.should.be.a('array');
    //             response.body.length.should.be.at.least(1);

    //             const videos = response.body;
    //             videos.forEach(video => {
    //                 expect(video).to.have.property('_id');
    //                 expect(video).to.have.property('title');
    //                 expect(video).to.have.property('description');

    //             });
    //             done();
    //         })
    // })

    // it('should return 201 status code and new user data when valid input is provided', (done) => {
    //     chai.request(server)
    //         .post('/signUp')
    //         .send({
    //             username: 'TEST USER',
    //             password: '101TESTpassword101',
    //             email: 'TESTEMAI@test.com'
    //         })
    //         .end((error, response) => {
    //             expect(response).to.have.status(201);
    //             expect(response.body).to.be.an('object');
    //             expect(response.body).to.have.property('username', 'TEST USER');
    //             expect(response.body).to.have.property('email', 'TESTEMAI@test.com');
    //             expect(response.body).to.have.property('_id');
    //             done();
    //         })
    // });

    it('should return 422 status code and error message when invalid input is provided', (done) => {
        chai.request(server)
            .post('/signUp')
            .send({
                username: '',
                password: '',
                email: 'invalidemail'
            })
            .end((error, response) => {
                expect(response).to.have.status(422);
                expect(response.body).to.be.an('object');
                expect(response.body.errors).to.be.an('array').that.is.not.empty;
                done();
            })
    });
    it('should return a token for valid credentials', (done) => {
        chai.request(server)
            .post('/login')
            .send({ email: 'TESTEMAI@test.com', password: '101TESTpassword101' })
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('accessToken');
                done();
            });
    });

    it('should return an error for invalid email', (done) => {
        chai.request(server)
            .post('/login')
            .send({ email: 'TESTEMAasasIest.com', password: '101TESTpassword101' })
            .end((err, res) => {
                expect(res).to.have.status(422);
                expect(res.body.errors[0].msg).to.equal('Not a valid Email!');
                done();
            });
    });

    it('should return an error for empty password', (done) => {
        chai.request(server)
            .post('/login')
            .send({ email: 'TESTEMAI@test.com', password: '' })
            .end((err, res) => {
                expect(res).to.have.status(422);
                expect(res.body.errors[0].msg).to.equal('Password should not be empty!');
                done();
            });
    });

    it('should return an error for incorrect password', (done) => {
        chai.request(server)
            .post('/login')
            .send({ email: 'TESTEMAI@test.com', password: 'wronsadgpassword' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('Password is incorrect!');
                done();
            });
    });

    it('should return an error for unregistered email', (done) => {
        chai.request(server)
            .post('/login')
            .send({ email: 'asdjaksdb@sdib.com', password: 'password123' })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.text).to.equal('Not a registered Email');
                done();
            });
    });


    it('should return "Valid Token" for a valid JWT token', (done) => {
        // Login and get a valid JWT token
        let token = ''
        chai.request(server)
            .post('/login')
            .send({
                email: 'as@as.as',
                password: 'as@as.as'
            })
            .end((error, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('accessToken');
                token = res.body.accessToken
                chai.request(server)
                    .get('/validateToken')
                    .set('authorization', `Bearer ${token}`)
                    .end((error, res) => {
                        expect(res).to.have.status(200);
                        expect(res.text).to.equal('Valid Token')
                        done();
                    });
            })
    })

    it('should return posts that match the search query', (done) => {
        // Login and get a valid JWT token
        let token = '';
        chai.request(server)
            .post('/login')
            .send({
                email: 'as@as.as',
                password: 'as@as.as'
            })
            .end((error, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('accessToken');
                token = res.body.accessToken;

                // Make a request to the /search endpoint with the search query and JWT token
                chai.request(server)
                    .get('/search')
                    .set('authorization', `Bearer ${token}`)
                    .query({ searchString: 'Stereo' })
                    .end((error, res) => {
                        expect(res).to.have.status(200);
                        expect(res.body).to.be.an('array');
                        // expect(res.body.length).to.be.greaterThan(0);
                        done();
                    });
            });
    });

    it('should return 404 if _id is not a valid MongoDB ObjectId', (done) => {
        let token = '';
        chai.request(server)
            .post('/login')
            .send({
                email: 'as@as.as',
                password: 'as@as.as'
            })
            .end((error, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('accessToken');
                token = res.body.accessToken;

                chai.request(server)
                    .get('/viewPost')
                    .set('authorization', `Bearer ${token}`)
                    .query({ _id: 'invalid_id' })
                    .end((err, res) => {
                        const { errors } = res.body
                        const fMsg = errors[0]
                        expect(res).to.have.status(404);
                        console.log(res)
                        expect(res.body.errors[0].msg).to.equal('NOT A VALID ID OR THIS DATA DOESNT EXIST!!!')
                        // console.log()
                        // console.log(typeof (res.error))
                        // expect()
                        done();
                    });

            });

    });

    // it('should return 404 if _id does not exist in the database', (done) => {
    //     request(app)
    //         .get('/viewPost?_id=606c7f06cb04891cc49bc79c')
    //         .set('Authorization', `Bearer ${token}`)
    //         .expect(404)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             expect(res.body.errors).toContainEqual({
    //                 location: 'params',
    //                 msg: 'NOT A VALID ID OR THIS DATA DOESNT EXIST!!!',
    //                 param: '_id',
    //                 value: '606c7f06cb04891cc49bc79c',
    //             });
    //             done();
    //         });
    // });

    //   it('should return the post object if _id exists in the database', (done) => {
    //     request(app)
    //       .get('/viewPost?_id=606c7f06cb04891cc49bc79d')
    //       .set('Authorization', `Bearer ${token}`)
    //       .expect(200)
    //       .end((err, res) => {
    //         if (err) return done(err);
    //         expect(res.body).toMatchObject({
    //           _id: '606c7f06cb04891cc49bc79d',
    //           title: 'My First Post',
    //           content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    //           author: 'John Doe',
    //         });
    //         done();
    //       });
    //   });
});



