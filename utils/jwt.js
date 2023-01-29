const jwt=require('jsonwebtoken');

const createToken=({payload})=>{
    const token=jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES})
    return token
}

const verifyToken=({token})=> jwt.verify(token,process.env.JWT_SECRET)


/* const attachCookie=({res,payloadUser})=>{
    const token= createToken({payload:payloadUser})
    const twoDays=1000* 60* 60 *48
    res.cookie('token',token,{
        httpOnly:true,
        expires:new Date(Date.now()+twoDays),
        secure:process.env.NODE_ENV==='production',
        signed:true,
    })
}    */



module.exports = {createToken,verifyToken}


