const mongo = require('mongoose')

const POST = new mongo.Schema({
    link: {
        type: String,
        required: [true, "Link Required"]
    },
    title: {
        type: String,
        required: [true, "Title Required"]
    },
    description: {
        type: String,
        required: [true, "Description Required"]
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const regex = /^(?:https:\/\/)(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;

POST.pre('save', function (next) {
    if (!regex.test(this.link))
        return next(new Error("Not a valid Link!!!"))
    if (this.title.length < 10)
        return next(new Error("Not a valid Title format(>=10) !!!"))
    if (this.description.length < 20)
        return next(new Error("Not a valid description formst(>=20) !!"))
    next();
})

POST.pre('updateOne', function (next) {
    const update = this.getUpdate().$set
    if (!regex.test(update.link))
        return next(new Error("Not a valid Link!!!"))
    if (update.title.length < 10)
        return next(new Error("Not a valid Title format(>=10) !!!"))
    if (update.description.length < 20)
        return next(new Error("Not a valid description formst(>=20) !!"))
    next();
})




module.exports = mongo.model('Video', POST)

