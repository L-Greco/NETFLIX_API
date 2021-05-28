
import { body } from "express-validator"

export const commentsValidation = [
    body("comment").exists().withMessage("Comment is a mandatory field!"),
    body("rate").exists().isInt({ min: 0, max: 5 }).withMessage("Rating needs to be a number between 0 and  5")
]