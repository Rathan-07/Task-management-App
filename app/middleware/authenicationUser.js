const jwt = require('jsonwebtoken')
const authenticationUser = (req,res,next)=>{
    const token = req.headers['authorization']
    if(!token){
        return res.status(400).json({token:"token not found"})

    }
    try {
        const tokenData = jwt.verify(token,process.env.JWT_SECRET)
        req.user = {
            id:tokenData.id,
            role:tokenData.role
        }
        next()
    }
    catch(err){
        res.status(400).json({error:err})
    }
    }
    module.exports = authenticationUser

