import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from './routes/userRoutes.js'
import bookRoutes from './routes/bookRoutes.js'
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import reviewRoutes from "./routes/reviewRoutes.js"
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config()
connectDB()

const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.get("/", (req, res) => {
    res.send("API IS RUNNING...")
})
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.use("/user", userRoutes)
app.use("/books", bookRoutes)
app.use("/review", reviewRoutes)

app.use('', express.static(join(__dirname, 'upload')));

app.use(notFound)
app.use(errorHandler)


app.listen(port, () => console.log(`Server running on port ${port}`));
