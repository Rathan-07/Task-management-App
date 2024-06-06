const { validationResult } = require("express-validator")
const bcryptjs = require('bcryptjs')
const userCltr = {}
const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
userCltr.register = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})

    }
    try {
        const body = req.body
        const salt = await bcryptjs.genSalt()
        const hashPassword = await bcryptjs.hash(body.password,salt)
        const user = new User(body)
        user.password = hashPassword
        await user.save()
        res.status(201).json(user)

    }
    catch(error){
        res.status(500).json({error:"Something went wrong"})
    }
}
userCltr.checkEmail = async(req,res)=>{
    const email = req.query.email;
    try{
        const user = User.findOne({email})
        if(user){
            res.json({'is_registered_email':true})
        }
        else {
            res.json({'is_registered_email':false})
        }
    }
    catch(error){
        res.status(500).json({ error: 'Something went wrong' });
    }
    }

userCltr.login = async (req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    try{
        const body = req.body;
        const user = await User.findOne({email:body.email})
        // console.log(user);
        if(user){
            const isAuth = await bcryptjs.compare(body.password,user.password)
            if(isAuth){
                const tokenData = {
                    id:user._id,
                    role:user.role
                }
                const token = jwt.sign(tokenData,process.env.JWT_SECRET,{expiresIn:'7d'})
                return res.json({token:token})

            }
            return res.status(400).json({ errors: 'Invalid email/password' })

        }
        return res.status(400).json({ errors: 'Invalid email/password' })
     

        
    }
    catch(error){
        res.status(500).json({ errors: "Something went wrong" })
    }
}
userCltr.account = async(req,res)=>{
    try{
        const user = await User.findById(req.user.id)
        res.json(user)
    }
    catch(err){
        res.status(500).json({errors:"something went wrong"})
    }
}
userCltr.get = async (req,res)=>{
    try {
        const user = await User.find()
        console.log(user);
        res.json(user)
    }
catch(err){
    res.status(500).json({errors:"something went wrong"})
}
}
module.exports = userCltr;