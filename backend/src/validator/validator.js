import { body } from 'express-validator'

export const userValidationRule = (req , res) =>{
    return [
        body('fullName').notEmpty().withMessage('Full Name is required! '),
        body('email').isEmail().withMessage('please provide correct email formate!'),
        body('username').notEmpty().withMessage('username is required!'),
        body('password').notEmpty().isLength({min : 5}).withMessage('Password must be at least 6 characters long')
    ];
}
