const mongoose = require('mongoose');

const connectDb=(uri)=>{
    mongoose.set("strictQuery",true);
    return mongoose.connect(uri);
}


module.exports=connectDb;