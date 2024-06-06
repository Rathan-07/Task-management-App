const authorizedUser = (permittedUser)=>{
 return (req,res,next)=>{
    if(permittedUser.includes(req.user.role)){
        next()

    }
    else {
        res.status(403).json({errors:"unauthorized User"})
    }
 }
}
module.exports  = authorizedUser;