const CustomError = require("../errors");
const { verifyToken } = require("../utils/jwt");



const authenticateUser = async (req, res, next) => {
  const authHeader=req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) 
    throw new CustomError.UnauthenticatedError("Authentication invalid.");

  const token= authHeader.split(" ")[1];

  try {
    const payloadVerify = verifyToken({token});
    req.user = {
      userId: payloadVerify.userId,
      name: payloadVerify.name,
      role: payloadVerify.role,
    };

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication invalid.");
  }
};


//*For permissions roles middleware
const rolesPermissions=async(req, res, next) => {
  const {role}=req.user;
  if(role==='user'){
    throw new CustomError.UnauthorizedError("Solo el usuario admin puede acceder a esta ruta");
  }
  next();
};


module.exports = {
  authenticateUser,
  rolesPermissions,
};
