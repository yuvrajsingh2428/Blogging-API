const { response } = require('express')
const Blog = require('../models/article.js')

const createBlog = async (req, res, next) => {
    try {
        // Debug log to check if req.user is available
        console.log('req.user:', req.user);

        // Check if req.user is defined
        if (!req.user || !req.user._id) {
            console.log('req.user is undefined:', req.user); // Debug log
            throw new Error('User not authenticated');
        }
        
        //grab details from request
        const { title, description, tags, body } = req.body

        // Ensure tags is an array; default to empty array if not provided
        const normalizedTags = Array.isArray(tags) ? tags : [];

        // create blog object
        const newBlog = new Blog({
            title, 
            description: description || title,
            tags,
            author: req.user._id,
            body,
            owner: req.user.username, // Assuming `owner` is a username
        })
        // Save to database 
        const createBlog = await newBlog.save()

        // Initialize articles array if undefined
        if (!req.user.articles) {
            req.user.articles = [];
        }

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

         // Initialize filter object for the query
        const filter = {}; // Only fetch published blogs
        if (req.query.tags) {
            filter.tags = { $regex: new RegExp(req.query.tags, 'i') }; // Case-insensitive search
        }
        
        // Get total count of blogs matching the filter
        const totalResults = await Blog.countDocuments(filter);

        // Fetch blogs based on the filter, fields, and pagination
        const blogs = await Blog
        .find(filter)
        .select(req.fields)
        .populate('author', {username: 1})
        .skip(req.pagination.start)
        .limit(req.pagination.sizePerPage)

        // Calculate Page information (results, total pages, etc.)
        const totalPages = Math.ceil(totalResults / req.pagination.sizePerPage)
        const currentPage = req.pagination.page


        const pageInfo = {
            results: blogs.length,
            totalPages: totalPages,
            currentPage: currentPage,
        }

        // Return the response with blogs and pagination info

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

        if(!blog){
            return res.status(401).json({
                status: false,
                error:"Blog not found",
            })
        }

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