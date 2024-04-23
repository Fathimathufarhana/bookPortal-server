import jwt from "jsonwebtoken";
import HttpError from "../middlewares/httpError.js";
import { validationResult } from "express-validator";
import User from "../models/user.js";
import bcrypt from "bcrypt"


export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if ( ! errors.isEmpty() ) {
      return next( new HttpError(
         "Invalid data inputs passed, Please check your data before retry!",
         422 
         ));
  } else {
      const { 
        first_name, 
        last_name,
        gender,
        date_of_birth,
        phone_number,
        email, 
        password, 
        role
      } = req.body
   
    const saltRounds = parseInt(process.env.SALT_ROUNDS);
  
    const salt = bcrypt.genSaltSync( saltRounds );
    const hash = bcrypt.hashSync( password, salt );
    const newUser = new User({ 
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone_number, 
      email, 
      password: hash, 
      role
    });
    const savedUser = await newUser.save();
      if ( ! savedUser ){
        return next( new HttpError( "Oops! Something went wrong!!", 500 ) );
      } else {
            res.status(200).json({ 
              status: true,
              message: '',
              data: savedUser,
              access_token: null 
            })
      }
  }
  } catch ( error ) {
      return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
  }
}



export const login =async (req, res, next) => {
    try {
      const errors = validationResult(req);
        if ( ! errors.isEmpty() ) {
            return next( new HttpError( 
              "Invalid data inputs passed, Please check your data before retry!",
              422 
              ));
        } else {
            const { email } = req.body 
            const user = await User.findOne({ email: email });
            
            if ( ! user ) {
              return next( new HttpError( "Invalid credentials",400 ) )
            } else {
              const isPassword = await bcrypt.compare( req.body.password, user.password );
             if( isPassword ){
                 const token = jwt.sign(
                  { userId : user._id, userEmail : user.email, role : user.role }, 
                  process.env.JWT_SECRET,
                  { expiresIn: process.env.JWT_TOKEN_EXPIRY }
                   );
                 res.status(200).json({
                   status : true,
                   message : 'Login successful',
                   access_token : token
                 })
             }
             else{
              return next( new HttpError( "Invalid credentials", 500 ) );
             }
             }
        }
    } catch ( error ) {
        return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
    }
}

export const authConfirmTest = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if ( ! errors.isEmpty() ) {

        return next( new HttpError( 
          "Invalid data inputs passed, Please check your data before retry!",
          422 
          ));
      } else {
        const { userId } = req.userData 
         res.status(200).json({
                status : true,
                message : '',
                data: userId,
                access_token : null
              })
          }
    } catch ( error ) {
      return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
    }
  };