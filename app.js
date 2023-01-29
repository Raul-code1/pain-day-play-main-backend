require("dotenv").config();
require("express-async-errors");

//*Db
const connectDb = require("./db/connectDb");

//*Express
const express = require("express");
const app = express();

//*Rest of the packages
const cors=require('cors')
const morgan=require('morgan')
const fileUpload=require('express-fileupload');


//*Routers
const authRouter=require('./routes/authRoutes')
const userRouter=require('./routes/userRoutes')
const companyRouter=require('./routes/companyRoutes')

//*Middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());
app.use(morgan('tiny'))
app.use(cors());
app.use(fileUpload());

app.use(express.static('./public'))
   
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/user',userRouter);
app.use('/api/v1/companies',companyRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = process.env.PORT;
const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, console.log(`Server listening on port ${port} `));
  } catch (error) {
    console.log(error);
  }
};

startServer();
