const router = require('express').Router()
const { findById } = require('../models/Post')
const Post = require('../models/Post')
const User = require('../models/User')

// router.get('/', (req, res) => {
//     console.log('Welcome to homepage')
// })

// create a post

router.post('/', async (req, res) => {
    const newPost = new Post(req.body)
    try {
        const savedPost = await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.send(500).json(error.message)
    }
})

// update a post
router.put('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body })
            res.status(200).json("The post has been updated")
        } else {
            res.status(403).json("you can only update your post")
        }
    } catch (error) {
        res.send(500).json(error.message)
    }
})
// delete a post
router.delete('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (post.userId === req.body.userId) {
            await post.deleteOne()
            res.status(200).json("The post has been deleted")
        } else {
            res.status(403).json("you can only delte your post")
        }
    } catch (error) {
        res.send(500).json(error.message)
    }
})
// like / dilike a post
router.put('/:id/like', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } })
            res.status(200).json("The post has been liked")
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } })
            res.status(200).json("The post has been disliked")
        }
    } catch (error) {
        res.send(500).json(error.message)
    }
})
// get a post
router.get('/:id', async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        res.status(200).json(post)

    } catch (error) {
        res.send(500).json(error.message)
    }
})
// get timeline post
router.get('/timeline/all', async (req, res) => {
    let postArray = []
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId: currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId: friendId})
            })
        )

        res.json(userPosts.concat(...friendPosts))

    } catch (error) {
        res.status(500).json(error.message)
    }
})
module.exports = router
