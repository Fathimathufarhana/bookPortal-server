import { check } from "express-validator";
import express from "express";
import { authConfirmTest, login, register } from "../controllers/userController.js";
import authCheck from "../middlewares/authCheck.js";


const router = express.Router()

router.post( '/login',
[
    check('email').not().isEmpty(),
    check('password').not().isEmpty()
], login);

router.post('/register',
[
    check('first_name').not().isEmpty(),
    check('date_of_birth').not().isEmpty(),
    check('phone_number').isLength({min: 10, max: 10}),
    check('email','Invalid Email').not().isEmpty().isEmail(),
    check('password','The minimum password length is 6 characters').isLength({min: 6})
] ,register)

router.use(authCheck);

router.post('/test_auth_check', authConfirmTest)



export default router

