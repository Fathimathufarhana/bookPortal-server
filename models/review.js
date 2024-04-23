import mongoose, { model, Schema } from "mongoose";

const reviewSchema = new Schema({
      user: {
        type: String,
        // required: true,
      },
      book:{
        ref : "books",
        type: mongoose.Schema.Types.ObjectId,
        required: true
      },
      review: {
        userid: String,
        type: String
      },
      rating: {
        type: Number,
        required: true
      }
      
}, { timestamps: true })

const Review = model("Review",reviewSchema)

export default Review;