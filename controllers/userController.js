const { StatusCodes }=require('http-status-codes')

const User= require('../models/User');
const CustomError = require("../errors");
const { checkPermissions, createToken } = require('../utils');




const getSingleUser=async(req,res)=>{
    const {id}=req.params;
    const user = await User.findOne({_id:id}).select('-password');
    if (!user) throw new  CustomError.NotFoundError(`No user found with id ${id}`);
    checkPermissions(req.user,user._id);
    res.status(StatusCodes.OK).json({user})
}


const updateUser=async(req,res)=>{
    const { userId }=req.user;
    const { name,username,email,favoriteSport }=req.body;
    if (!name || !username || !email ) throw new CustomError.BadRequestError('Please provide all the values');
    const user= await User.findOne({_id:userId}).select('-password');
    
    
    user.name = name;
    user.username = username;
    user.email = email;
    user.favoriteSport = favoriteSport;
    await user.save();

    const tokenUser={userId:user._id,name:user.name,role:user.role};
    const token= createToken({payload:tokenUser})
    
    res.status(StatusCodes.OK).json({user:tokenUser,token});
}



const updatepasswordUser=async(req,res)=>{
    const { userId }=req.user;
    const { password,newPassword }=req.body;
    if (!password || !newPassword) throw new CustomError.BadRequestError('Please provide all the values');
    
    const user= await User.findOne({_id:userId})
     
    const isPasswordValid=await user.comparePassword(password)
    if (!isPasswordValid) throw new CustomError.UnauthenticatedError('Invalid password');

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({msg:'Contraseña actualizada!'})

}




module.exports ={
    getSingleUser,
    updateUser,
    updatepasswordUser,
}






