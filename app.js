const express = require("express");
require("dotenv").config();
const app = express();
const path = require("path");

const connectDB = require("./connection/connection");
const usersRouter = require("./routes/user.route");
const paymentRouter = require('./routes/payment.route')

const bodyParser = require("body-parser");
app.use(bodyParser.json());
connectDB();
app.use("/api/user", usersRouter);
app.use("/api/user/pay", paymentRouter);


app.use('/test', usersRouter)

app.get('/', (req, res) => {
    res.send('Your Project is runing but route Error!');
});
app.get('/test', (req, res) => {
    res.send('This is the app.js file test route!');
});


app.listen(process.env.PORT, (error) => {
    if (!error)
        console.log("Server is Listening at Port " + process.env.PORT + "!");
    else console.log("Error Occurred");
});