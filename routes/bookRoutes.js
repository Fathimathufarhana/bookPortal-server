import express from "express";
import { createBook, deleteBook, editBook, listBooks } from "../controllers/bookController.js";
import authCheck from "../middlewares/authCheck.js";
import { check } from "express-validator";
import { upload } from "../middlewares/multer/fileUpload.js";

const router = express.Router()

router.post('/list/book',listBooks)

router.use(authCheck);

router.post("/create/book", upload.single('image'),
[
  check('name').not().isEmpty(),
  check('author').not().isEmpty(),
  check('genre').not().isEmpty(),
  check('published').not().isEmpty(),
  check('price').not().isEmpty(),
  check('language').not().isEmpty(),
  // check('image').not().isEmpty(),
], createBook);

router.patch("/edit/book", upload.single('image'), editBook)

router.patch("/delete/book",[check('bookid').not().isEmpty()], deleteBook)

export default router