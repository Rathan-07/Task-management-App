const User = require('../models/user-model')

const UserLoginValidationSchema = {
   
    email:{
        in:['body'],
        exists:{
        
            errorMessage:"Email field is required"
        },
        notEmpty:{
            errorMessage:"Email field cannot be empty"
        },
        isEmail:{
            errorMessage:"Email should be in valid  format "
        },trim:true,
      

    },
    password:{
        in:['body'],
        exists:{
        
            errorMessage:"password field is required"
        },
        notEmpty:{
            errorMessage:"password field cannot be empty"
        },trim:true,
        isLength:{
            options:{min:5,max:128},
            errorMessage:"password should be between 8 -128 characters"
        },
    },
 
}
module.exports = UserLoginValidationSchema