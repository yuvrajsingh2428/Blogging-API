const { response } = require('express')
const Blog = require('../models/article.model.js')

const createBlog = async (req, res, next) => {
    try {
        //grab details from request
        const { title, description, tags, body } = req.body

        // create blog object
        const newBlog = new Blog({
            title, 
            description: description || title,
            tags,
            author: req.user._id,
            body,
            owner: req.user.username,
        })
        // Save to database 
        const createBlog = await newBlog.save()

        // save blog ID to user document
        req.user.articles = req.user.articles.concat(createBlog._id)
        await req.user.save()

        //return response
        return res.status(201).json({
            status:true,
            data:createBlog,
        })
    } catch (e){
        e.source = 'creating a blog'
        next(e)
    }
}

const getBlogs = async(req, res, next) => {
    try{
        const blogs = await Blog
        .find(req.findFilter)
        .select(req.fields)
        .populate('author', {username: 1})
        .skip(req.pagination.start)
        .limit(req.pagination.sizePerPage)

        const pageInfo = req.pageInfo

        return res.json({
            status: true,
            pageInfo,
            data:blogs
        })
    }   catch(err){
        err.source = 'get published blogs controller'
        next(err)
    }
}

const getBlog = async (req, res, next) => {
    try{
        const{ id } = req.params
        const blog = await Blog.findById(id).populate('author', { username: 1})

        if(blog.state !== 'published'){
            return res.status(403).json({
                status:false,
                error: "Requisted article is not published",
            })
        }
        // update blog read count
        blog.read_count += 1
        await blog.save()

        return res.json({
            status:true,
            data:blog,
        })
    }   catch(err){
        err.source = 'get published blog controller'
        next(err)
    }
}

module.exports = {
    createBlog,
    getBlogs,
    getBlog
}