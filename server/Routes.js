const express = require('express');
const route = express.Router();
const POST = require('./videoSchema')
const USER = require('./userSchema')
const JWT = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');



const linkRegex = /^(?:https:\/\/)(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i


const cardDataValidator = [
    check('link').custom((value, { req }) => { //{ req } is passed os as to use other attributes in req body to validate some other field

        if (!value) {
            throw new Error('FIELD SHOULD NOT BE EMPTY!!!');
        }
        if (!linkRegex.test(value)) {
            {
                throw new Error('INVALID LINK!!!');
            }
        }
        return true;
    }),
    check('title').custom((value) => {
        if (value.length < 10)
            throw new Error('Minimum 10 characters are required!!!');
        if (value.length == 0)
            throw new Error('Title Field should not be Empty!!!')
        return true;
    }),
    check('description').custom((value) => {

        if (value.length < 20)
            throw new Error('Minimum 20 characters are required!!!');
        if (value.length == 0)
            throw new Error('Description Field should not be Empty!!!')
        return true;
    })
]


const verifyTokenMiddleware = (req, res, next) => {

    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const token = authorizationHeader.split(" ")[1];
        JWT.verify(token, 'USER_SECRET_KEY', (error, user) => {
            if (error) {
                return res.status(401).send('You are not authenticated')
            }
            else {
                next();
            }
        })
    }
    else {
        res.status(401).send("You are not authenticated")
    }

}


// Creating Post
const arr = {}
route.post("/createPost", async (req, res) => {
    console.log(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    else {
        const { link, title, description } = req.body;
        let data = new POST({
            link: link,
            title: title,
            description: description,
        })
        try {
            let response = await data.save();
            res.status(201).send(response)
        }
        catch (err) {
            console.log(err);
        }
    }
})


// Fetching all posts Data

route.get('/', verifyTokenMiddleware, async (req, res) => {
    try {
        const videos = await POST.find({}).sort({ _id: -1 });
        res.status(200).send(videos)
    } catch (er) {
        res.status(404).send('No Data found')
    }
})

// route.get('/', verifyTokenMiddleware, async (req, res) => {
//     const { page = 1, limit = 10 } = req.query; // default limit is 10
//     const skip = (page - 1) * limit;
//     const videos = await POST.find({})
//         .sort({ _id: -1 })
//         .skip(skip)
//         .limit(parseInt(limit));
//     res.status(200).send(videos);
// })

//  Updating Post


route.put('/editPost', verifyTokenMiddleware, cardDataValidator,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            res.status(422).json({ errors: errors.array() })
        else {
            const { _id, link, title, description } = req.body;
            try {
                const response = await POST.updateOne({ _id: _id }, { $set: { link: link, title: title, description: description, date: Date.now() } })
                // const response = await POST.findByIdAndUpdate(_id, { $set: { link: link, title: title, description: description, date: date } })
                if (response) {
                    res.status(201).send(response);
                }
                else {
                    res.status(400).send('somthing went wrong')
                }
            }
            catch (error) {
                res.send(error.message)
            }
        }
    })


const mongoIdValidator = [
    check('_id', 'NOT A VALID ID OR THIS DATA DOESNT EXIST!!!').custom((value) => {
        return mongoose.Types.ObjectId.isValid(value) && mongoose.model('Video').exists({ _id: value })
    })
]


//   Deleting Post

route.delete('/deletePost', verifyTokenMiddleware, mongoIdValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() })
    }
    else {
        const { _id } = req.query;
        const response = await POST.deleteOne({ _id: _id })
        res.status(200).send(response)
    }
})


//   Fetching single post data

route.get('/viewPost', verifyTokenMiddleware, mongoIdValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(404).json({ errors: errors.array() })
    else {
        const { _id } = req.query
        const result = await POST.find({ _id: _id })
        res.send(result === null ? "Error at backend api" : result)
    }
})


const signUpDataValidator = [
    check('email').custom(async (value, { req }) => {
        const uniqueEmailCheck = await USER.findOne({ email: value });
        if (uniqueEmailCheck !== null)
            throw new Error('Email already taken!')
        if (!emailRegex.test(value))
            throw new Error('Not a valid Email format')
        return true
    }),
    check('username').custom(async (value, { req }) => {
        if (value.length === 0)
            throw new Error('Username should not be empty!')
        if (value.length < 5)
            throw new Error('Minimum 5 character long username required!')
        return true;
    }),
    check('password').custom((value, { req }) => {
        if (value.length === 0)
            throw new Error('Password should not be empty!')
        if (value.length < 7)
            throw new Error('Minimum 7 character long password required!')
        return true;
    }),

]
//   SIGNUP

route.post('/signUp', signUpDataValidator, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        res.status(422).send({ errors: errors.array() })
    else {
        const { username, password, email } = req.body;

        bcrypt.hash(password, 10).then(async (hashedPassword) => {
            console.log(username, password, email)
            const userData = new USER({
                username: username,
                password: hashedPassword,
                email: email
            })
            const response = await userData.save();
            console.log(response)
            res.status(201).send(response)

        })
            .catch(er => res.status(400).send('Password encryption Error!'))
    }

})


//   LOGIN

const loginDataValidator = [
    check('email').custom((value, { req }) => {
        if (!emailRegex.test(value))
            throw new Error('Not a valid Email!')
        return true;
    }),
    check('password').custom((value, { req }) => {
        if (value.length === 0)
            throw new Error('Password should not be empty!')
        if (value.length < 7)
            throw new Error('Minimum 7 character long password required!')
        return true;
    })
]


route.post('/login', loginDataValidator, async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
    }
    else {
        const { email, password } = req.body;
        
        const response = await USER.findOne({ email: email });
        console.log(response)
        if (response) {
            const wrongPasswordError = await bcrypt.compare(password, response.password)
            // console.log(wrongPasswordError)
            if (wrongPasswordError) {
                console.log('entered')
                const payload = {
                    username: response.username,
                    email: response.email,
                }
                const accessToken = JWT.sign(payload, "USER_SECRET_KEY", { expiresIn: '2h' })
                res.json({
                    payload,
                    accessToken
                })
            }
            else
                res.status(400).send("Password is incorrect!")
        }
        else {
            res.status(400).send('Not a registered Email')
        }
    }
})


const searchPostInDatabase = [
    check('searchString').custom(async (value, { req }) => {

        var regexPattern = new RegExp(value, "i");
        const response = await POST.find({ title: { $regex: regexPattern } }).sort({ _id: -1 })
        if (response.length === 0)
            throw new Error('No post found!');
        return true;
    })
]


route.get('/search', verifyTokenMiddleware, searchPostInDatabase, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
    }
    else {
        const { searchString } = req.query
        var regexPattern = new RegExp(searchString, "i");
        const response = await POST.find({ title: { $regex: regexPattern } }).sort({ _id: -1 })
        res.status(200).send(response)
    }
})

route.get('/validateToken', verifyTokenMiddleware, async (req, res) => {
    console.log('ValidToken')
    res.status(200).send('Valid Token')

})

module.exports = route;











































// const loginPageRenderCheck = [
//     check('username').custom(async (value, { req }) => {
//         const uniqueUsernameCheck = await USER.findOne({ username: value });
//         const uniqueEmailCheck = await USER.findOne({ email: email })
//         if (uniqueUsernameCheck !== null || uniqueEmailCheck !== null)
//             throw new Error('Dont login')
//         return true;
//     })
// ];

// route.get('/findUser', loginPageRenderCheck, async (req, res) => {
//     const errors = validationResult(req);
//     console.log(errors)
//     // if (!errors.isEmpty()) {
//     //     res.status(422).json({ errors: errors.array() });
//     // }
//     // else {
//     //     res.send('Unique User')
//     // }
//     res.send(true)
// })
