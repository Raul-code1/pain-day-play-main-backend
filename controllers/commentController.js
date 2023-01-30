const { StatusCodes }=require('http-status-codes')

const Comment=require('../models/Comments')
const Company=require('../models/Company')
const User=require('../models/User')
const CustomError=require('../errors')
const {checkPermissions}=require('../utils')


const createCompanyComment=async(req,res)=>{
    const {company}=req.body;

    /* //?is this validation necessary */
    const companyExists=await Company.findOne({_id: company})
    if (!companyExists) throw new CustomError.NotFoundError(`No hay ninguna instalacion con el id ${company}`)
 

    const commentAlreadyExists=await Comment.findOne({user:req.user.userId,company:company})
    if (commentAlreadyExists) throw new CustomError.BadRequestError('Solo se puede comentar una vez');

    const userInfo=await User.findOne({_id:req.user.userId})

    req.body.user=req.user.userId
    req.body.userNameAuthor=userInfo.username

    const comment= await Comment.create(req.body)

    res.status(StatusCodes.CREATED).json({comment})
}


const getAllComments = async(req,res)=>{

    const comments = await Comment.find({}).populate({
        path:'company',
        select:'name',
    })
    res.status(StatusCodes.OK).json({comments,count:comments.length});
}


const getSingleComment = async(req,res)=>{
    const {id}=req.params

    const comment= await Comment.findOne({_id:id}).populate({
        path:'company',
        select:'name',
    })
    if (!comment) throw new CustomError.NotFoundError(`No se encontro comentario con el id ${id}`)


    res.status(StatusCodes.OK).json({comment})
}

const updateComment = async(req,res)=>{
    const {text}=req.body
    const {id}=req.params
    if (!text) throw new CustomError.BadRequestError('Por favor rellena el comentario');

    const comment=await Comment.findOne({_id:id})

    checkPermissions(req.user,comment.user)
    
    comment.text=text
    await comment.save();
    
    res.status(StatusCodes.OK).json({comment,msg:'Actualizado correctamente'});
}



const deleteComment = async(req,res)=>{
    const {id}=req.params
    const comment=await Comment.findOne({_id:id})
    if (!comment) throw new CustomError.BadRequestError(`No se encontro un comentario con el id ${id}`);
    
    checkPermissions(req.user,comment.user)
    await comment.remove();

    res.status(StatusCodes.OK).json({msg:'Eliminado correctamente'});
}


module.exports ={
    createCompanyComment,
    getAllComments,
    getSingleComment,
    updateComment,
    deleteComment,
}
