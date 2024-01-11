const mongo = require('mongoose')

const USER = mongo.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already regitered!"]
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i


USER.pre('save', function (next) {
    if (this.username.length < 5)
        next(new Error('Minimum 5 characters shoulb be there is username!'))
    if (!emailRegex.test(this.email))
        next(new Error('Not a valid email!'))
    next();
})

module.exports = mongo.model("Userdata", USER)


