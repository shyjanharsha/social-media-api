const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')

// router.get('/', (req, res) => {
//     res.send("Hey is user routes")
// })

//update a user
router.put('/:id', async (req,res)=> {
    if(req.body.userId === req.params.id || req.body.isAdmin){ //only admin can update a details 
        if(req.body.password){ //some case we need to change password 
            try {
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (error) {
                return res.send(500).json(error)
            }
        }
        try {
            const user = await User.findOneAndUpdate(req.params.id, {$set: req.body})
            res.status(200).json("Account has been updated")
        } catch (error) {
            return res.status(500).json(error)
            
        }
    }else{
        return res.status(403).json("You can update only your account")
    }

})
//delete a user

router.delete('/:id', async (req,res)=> {
    if(req.body.userId === req.params.id || req.body.isAdmin){ //only admin can delete
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted")
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        return res.status(403).json("You can delete only your account")
    }

})
//get a user
router.get('/:id', async (req,res)=> {
        try {
            const user = await User.findById(req.params.id)
            const { password, updatedAt, ...other} = user._doc // only send particular data's
            console.log(other, "alalalalal")
            res.status(200).json(other)
        } catch (error) {
            return res.status(500).json(error)
        }
})
//follow a user  
router.put('/:id/follow', async (req,res)=> {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            console.log(user, "USER")
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId}})
                await currentUser.updateOne({$push: {followings: req.params.id}})
                res.status(200).json("user has been followed")
            }else{
                res.status(403).json("You already follow  this user")
            }
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }else{
        res.status(403).json("You cant't follow your self")
    }
})
//unfollow a user

router.put('/:id/unfollow', async (req,res)=> {
    if(req.body.userId !== req.params.id){
        try {
            const user = await User.findById(req.params.id)
            console.log(user, "USER")
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId}})
                await currentUser.updateOne({$pull: {followings: req.params.id}})
                res.status(200).json("user has been unfollowed")
            }else{
                res.status(403).json("You don't follow this user")
            }
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }else{
        res.status(403).json("You cant't unfollow your self")
    }
})

module.exports = router