import { validationResult, body } from "express-validator";

function validate(req, res, next) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(409).json({
            errors: errors.array()
        })
    }

    next()
}

export const addUserValidation = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isString().withMessage('Username should be valid string'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .trim()
        .isEmail().withMessage('Email should be a valid email'),

    body('password')
        .notEmpty()
        .trim()
        .isLength({ min: 8, max: 30 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    validate
]

export const loginValidation = [
     body('email')
        .notEmpty().withMessage('Email is required')
        .trim()
        .isEmail().withMessage('Email should be a valid email'),

    body('password')
        .notEmpty()
        .trim()
        .isLength({ min: 8, max: 30 }).withMessage('Password must be at least 8 characters long'),

    validate
]

export const resetPasswordValidation = [
    body('newPassword')
        .notEmpty().withMessage('Password is required')
        .trim()
        .isLength({ min: 8, max: 30 }).withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required'),
        
    validate
]