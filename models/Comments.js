const {Schema , model,Types} = require('mongoose');


const CommentSchema= new Schema({
    user:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    company:{
        type:Types.ObjectId,
        ref:'Company',
        required:true
    },
    text:{
        type:String,
        required:[true],
        maxLength:[100,'El comentario solo puede ser de 100 caracteres'],
    },
    userNameAuthor:{
        type:String,
        required:true,
    }
},{
    timestamps:true
});


module.exports = model('Comment', CommentSchema);

