const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const helmet = require('helmet')
const morgan = require('morgan')
const userRoute = require('./routes/users')
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts')
// const { application } = require("express");

dotenv.config();
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err)=> {
    if(err)console.log(err.message, "AAAAAAAA")
    else console.log("Connected to mongoDb")
    // console.log("Connected to mongoDb")
});
// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
//     app.listen(8800, ()=>{
//         console.log("Backend Server is running!")
//     }) 
// }).catch((error) => console.log(error.message))

//middleware

app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

// app.get('/', (req, res) => {
//     res.send('Welcome to homepage')
// })


app.use('/api/users', userRoute)
app.use('/api/auth', authRoute)
app.use('/api/post', postRoute)


app.listen(8800, ()=>{
    console.log("Backend Server is running!")
}) 