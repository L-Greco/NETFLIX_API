
import { body } from "express-validator"

export const moviesValidation = [
    body("Year").exists().withMessage("Year is a mandatory field!"),
    body("Title").exists().withMessage("Title is a mandatory field!"),
    body("Category").exists().withMessage("Category is a mandatory field!")
]