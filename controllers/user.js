const User = require('../models/user.js');

// Function to create a new user
const createUser = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const { firstName, lastName, username, email, password } = req.body;

        // Check if a user with the same username or email already exists
        //console.log('Checking for existing user...');

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        //console.log('Existing user:', existingUser);

        if (existingUser) {
            //console.log('User with this username or email already exists');
            return res.status(409).json({ message: 'User with this username or email already exists' });
        }

        // Create and save the new user
        //console.log('Creating new user...');

        const newUser = new User({ firstName, lastName, username, email, password });

        //console.log('Saving new user...');

        const createdUser = await newUser.save();
        
        //console.log('User created successfully:', createdUser);

        // Send success response
        //console.log('Sending success response...');

        return res.status(201).json({
            status: true,
            data: createdUser,
        });
    } catch (e) {
        console.error('Error:', e.message);
        return res.status(500).json({
            status: false,
            message: e.message || 'Internal Server Error',
        });
    }
};

//  //logout user using simple way 
// const logoutUser = async(req, res) => {
//     // Since JWT is stateless, logging out is handled on the client side by deleting the token.
//     // You can optionally add a blacklist token mechanism if need
//     return res.status(200).json({
//         message:"Logout successfull"
//     })
// }


// using seesion logout user

const logoutUser = async(req, res) => {
    console.log('Session before logout:', req.session);
    // check if user is logged in

    if(req.session.userId){
        req.session.destroy((err) => {
            if(err){
                console.error('Logout error:', err);
                return res.status(500).json({
                    message:"Logout failed"
                })
            }
            return res.status(200).json({
                message:"Logout successfull"
            })
        });  
        
    } else{
        return res.status(400).json({
            message:"You need to log in first"
        })
    }
}

module.exports = {
    createUser,
    logoutUser,
};
