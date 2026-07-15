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

export const workspaceValidation = [
    body("name")
        .notEmpty().withMessage("Workspace name is required"),

    body("description")
        .notEmpty().withMessage("AssignTo is Required"),

    body("members")
        .isArray().withMessage("Members have to be in Array"),

    body("members.*")
        .isMongoId().withMessage("Each member must be a valid MongoId"),

    validate
]
