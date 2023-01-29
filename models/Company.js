const {Schema , model,Types} = require('mongoose');

const PricingSchema=new Schema({
    planName:{
        type:String,
        required:[true,'Please provide a plan name'],
        trim:true,
    },
    price:{
        type:Number,
        default:0
    }
})

const CompanySchema= new Schema({

    name:{
        type:String,
        required:[true,'Please provide a company name'],
    },
    location:{
        type:String,
        required:[true,'Please provide a location'],
        trim:true,
    },
    description:{
        type:String,
        required:[true,'Please provide a description'],
        maxLength:[1000,'Description length must be under 1000 characters']
    },
    category:{
        type:String,
        required:[true,'Please provide a category'],
        enum:['paintball','airsoft','laser tag'],
        default:'paintball'
    },
    pricing:[PricingSchema],
    image:{
        type:String,
        default:'/uploads/default.jpg',
    },
    contactPhone:{
        type:String,
        required:[true,'Please provide a contact phone number'],
    },
    website:{
        type:String,
        required:[true,'Please provide a webstite'],
    },
    user:{
        type:Types.ObjectId,
        refer:'User',
        required:true,
    }
})






module.exports= model('Company',CompanySchema);


