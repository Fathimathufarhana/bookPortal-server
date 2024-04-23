import { validationResult } from "express-validator"
import HttpError from "../middlewares/httpError.js"
import Book from "../models/book.js"
import fs from "fs"


export const listBooks = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (! errors.isEmpty() ) {
            return next(new HttpError("Something went wrong...", 422))
        } else {
            let query ={}

           if ( req.query.key ){
            query.$or =[
                { "name": { $regex: req.query.key, $options: "i" } },
                { "author": { $regex: req.query.key, $options: "i" } }
            ]
           }
            const books = await Book.find({ isDeleted : false , ...query } ) 


            res.status(200).json({
                status: true,
                message: '',
                data: books,
                access_token: null
            })
        }
    } catch (err) {
        return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) )
    }
}


export const createBook = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (! errors.isEmpty() ) {
            return next( new HttpError( "Something went wrong...", 422 ) )
        } else {
            const { role } = req.userData;
            const { 
                name, 
                author, 
                genre, 
                star_rating, 
                published, 
                price, 
                language
                    } = req.body;

            const image = req.file ? process.env.BASE_URL + "books/cover_images/" + req.file.filename : null;
    
            if ( role === 'admin'){
                const newBook = new Book({
                    name,
                    author,
                    image,
                    genre,
                    star_rating,
                    published,
                    price,
                    language
                   });
               
                   const savedBook = await newBook.save();
         
                   if ( ! savedBook ){
                     return next(new HttpError("Oops! Process failed, please do contact admin", 500));
                   } else{ 
                       res.status(201).json({
                         status: true,
                         message: '',
                         data: savedBook,
                         access_token: null
                       });
                   }
            } else {
                return next( new HttpError( "Access denied!!", 500 ) );
            }
        }
    } catch (error) {
        return next(new HttpError("Oops! Process failed, please do contact admin", 500));
    }
}

export const editBook = async(req, res, next) => {
    try {
        const errors = validationResult(req)
        if (! errors.isEmpty() ) {
            return next( new HttpError( "Something went wrong...", 422 ) )
        } else {
            const { role } = req.userData
            const { 
                bookid,
                name,
                author,
                genre,
                star_rating,
                published,
                price,
                language,
                } = req.body;

         
            if ( role === 'admin'){
                const bookData = await Book.findOne({ _id : bookid })
                const image = req.file ? 
                         process.env.BASE_URL + "/books/cover_images/" + req.file.filename : 
                         bookData.image
                if ( req.file && bookData.image !== null ) {
                    const prevImgPath = bookData.image.slice(22)
                    fs.unlink(`./upload/${ prevImgPath }`, (err) => {
                        if (err) {
                            console.error(err)
                            return
                        }
                    })
                } 
                const editBook = await Book.findOneAndUpdate(
                    { _id: bookid },
                    { 
                        name, 
                        author,
                        genre,
                        star_rating,  
                        published, 
                        price, 
                        language,
                        image
                     },
                     { new : true})
                if ( ! editBook ){
                    return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
                } else {
                    res.status(200).json({  
                        status: true,
                        message: '',
                        data: editBook,
                        access_token: null
                    })
                }
            } else {
                return next( new HttpError( "Access denied!!", 500 ) );
            }
            
        }
    } catch ( error ) {
        // return next(new HttpError("Oops! Process failed, please do contact admin", 500));
        console.log(error.message)
    }
}


export const deleteBook = async (req, res, next) => {
    try {
        const errors = validationResult(req)
        if (! errors.isEmpty() ) {
            return next( new HttpError( "Something went wrong...", 422 ))
        } else {
            const { role } = req.userData
            const { bookid } =req.body;

            if ( role === 'admin' ) {
                await Book.findOneAndUpdate(
                    { _id :bookid },
                    { isDeleted : true },
                    { new : true }
                    )
                res.status(200).json({  
                    status: true,
                    message: 'Book deleted',
                    data: null,
                    access_token: null 
                })
            } else {
                return next( new HttpError( "Access denied!!", 500 ) );
            }
        }
    } catch ( error ) {
        return next( new HttpError( "Oops! Process failed, please do contact admin", 500 ) );
    }
}

