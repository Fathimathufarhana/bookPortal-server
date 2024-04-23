import { validationResult } from "express-validator";
import Review from "../models/review.js";
import HttpError from "../middlewares/httpError.js";


export const addReview = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (! errors.isEmpty()) {
            return next( new HttpError ( "Invalid data inputs passed, Please check your data before retry!",422 ));
        } else {
            const { book, rating, review } = req.body
            const { userId } = req.userData
            const newuser = new Review({
               user : userId,
               book: book,
               rating,
               review
            })
            await newuser.save()
            if ( ! newuser ){
            return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
            } else {
                res.status(200).json({ 
                    status: true,
                    message: '',
                    data: newuser,
                    access_token: null 
                })
            }
        }
    } catch ( error ) {
        return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
    }
}