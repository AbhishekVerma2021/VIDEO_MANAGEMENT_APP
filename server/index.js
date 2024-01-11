const express = require('express');
const app = express();
const routes = require('./Routes')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()

app.use(cors())

app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', routes);


let db_url;

if (process.env.NODE_ENV == "dev") {
    db_url = process.env.DB_URL;
}
else if (process.env.NODE_ENV == "test") {
    db_url = process.env.DB_TEST_URL;
}


mongoose.connect(db_url).then(() => {
    console.log(`${db_url} DB CONNECTED!!!`)
}).catch(er => console.log(er))


app.listen(8000, () => console.log("LISNING TO PORT 8000!!!"))

module.exports = app;