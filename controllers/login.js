const router = require('express').Router()
const User = require('../models/user.js')


const loginUser = async (req, res, next) => {
    try{
        //grab username and password from the user
        const {username, password} = req.body

        //check database for user
        const user = await User.findOne({username})

        const passwordIsValid = user !== null && await user.passwordIsValid(password);

        
        if (!(user && passwordIsValid)){
            return res.status(403).json({
                message:'Username/ password is incorrect',
            })
        }
        
        // Create a session
        req.session.userId = user._id;
        req.session.username = user.username;

        console.log('Session:', req.session);  // Debug log


        res.json({
            message:"Login sucessfull",
            username: user.username,
            name: user.firstName
        })
    } catch(e){
        next(e)
    }
}

module.exports = {
    loginUser
}