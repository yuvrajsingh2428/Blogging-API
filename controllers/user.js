const User = require('../models/user.js')

const createUser = async (req, res, next) => {
    
    try{
        // grab all the details from the request
        console.log('Request body:', req.body);
        const { firstName, lastName, username, email, password, } = req.body
        

        // check if a user with same username and email already exists

        const existingUser = await User.findOne({ 
            $or: [{username}, {email}]
        })

        if (existingUser) {
            console.log('User already exists:', existingUser);
            const error = new Error('User with this username or email already exists');
            error.statusCode = 409; // Conflict error
            throw error;
        }

        // create user object
        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password,
        })
        // save the data to database
        console.log('Saving user to database...');
        try {
            const createdUser = await newUser.save();
            res.send({user:User._id})
        } catch (error) {
            res.status(400).send(err)
        }

        // return response
        console.log('User created successfully:', createdUser);
        
        return res.status(201).json({
            status:true,
            data: createdUser,
        })
    } catch(e){
        console.error('Error during signup:', e);
        next(e)
    }
}

module.exports = {
    createUser
}