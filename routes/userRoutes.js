const express = require('express');
const router=express.Router();


const {
    getSingleUser,
    updateUser,
    updatepasswordUser,
}=require('../controllers/userController')

const {
    authenticateUser
} =require('../middleware/authentication')



router.route('/updateUser').patch(authenticateUser,updateUser)
router.route('/updatePasswordUser').patch(authenticateUser,updatepasswordUser)

router.route('/:id').get(authenticateUser,getSingleUser)




module.exports =router;