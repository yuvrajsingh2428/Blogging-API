const mongoose = require('mongoose')
const {readingTime } = require('../utils/utils')

const articleSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            unique: true,
        },
        description:{
            type:String,
            author:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            }
        },
        owner:{
            type:String,
        },
        state:{
            type:String,
            default:'draft',
            enum:['draft','published'] //enum limits the values in a particular field
        },
        read_count: {
            type:Number,
            default:0,
        },
        reading_time: Number,
        tags:[String],
        body:String,
    
},
    {
        timestamps:true
    }
)
// using pre hook
// calculate reading time before saving document
    articleSchema.pre('save', function(next) {
        let article = this

        // do nothing if the article body is unchanged
        if(!article.isModified('body')) 
            return next()

        //calculate the time in minutes
        const timeToRead = readingTime(this.body)

        article.reading_time = timeToRead
        next()
    })

    // how the article data should be serialized to JSON
    articleSchema.set('toJSON', {
        transform:(document, returnedObjects) => {
            delete returnedObjects.__v 
            delete returnedObjects.owner
        },

        //It removes two fields (__v and owner) from the JSON 
        //representation of the article object before sending it as a response or saving it elsewhere.
    })

module.exports = mongoose.model('Article', articleSchema)



