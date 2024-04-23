import { model, Schema } from "mongoose";

const bookSchema = new Schema({
      name: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      star_rating: {
        type: Number
      },
      genre: {
        type: String,
        required: true,
      },
      published: {
        type: Date,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      language: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        // required: true,
      },
      isDeleted: {
        type: Boolean,
        default: false
      }
      
}, { timestamps: true })

const Book = model("Book",bookSchema)

export default Book;