const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

//REGISTER
router.post('/register', async (req, res) => {
    // try {
    //     const user = new User({
    //         username: "John",
    //         email: "john@gmail.com",
    //         password: "123456"
    //     })
    //     await user.save()
    //     console.log(user, "A")
    // res.send("ok")

    // } catch (error) {
    //     console.log(error.message)
    // }
    console.log("AAAAAAA")
    
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password, salt)
        //Create new User
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPassword,
            
        })
        // save user and return response
        const user = await newUser.save()
        console.log('user', user)
        res.status(200).json({user})
    } catch (error) {
        res.status(500).json(error)
        // console.log('error', error.message)
    }

})

router.post('/login', async (req,res)=> {
    try {
        const user = await User.findOne({email: req.body.email})
        !user && res.status(404).send("user not found")
        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).json("Wrong password")

        res.status(200).json(user)
    } catch (error) {
        // console.log(error.message)
        res.status(500).json(error)
    }
})

module.exports = router