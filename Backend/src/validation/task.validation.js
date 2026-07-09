import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(409).json({
            errors: errors.array()
        })
    }

    next()
}

export const taskValidation = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isString().withMessage("Title should be a valid string"),

    body("description")
        .isString().withMessage("Description should be valid string"),

    body("assignTo")
        .notEmpty().withMessage("Assign to is required")
        .isMongoId().withMessage("Assign to should be a valid string"),

    body("dueDate")
        .notEmpty().withMessage("Due date is required")
        .isDate().withMessage("Due date should be a valid date"),

    validate
]
