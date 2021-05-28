import express from "express"
import uniqid from "uniqid"
import createError from "http-errors"
import { validationResult } from "express-validator"
import { commentsValidation } from "./validation.js"
import { getComments, writeComments } from "../library/fs-tools.js"


const commentsRouter = express.Router()


commentsRouter.post("/:movieId", commentsValidation, async (req, res, next) => {

    try {


        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            next(createError(400, { errorList: errors }))

        } else {
            const comments = await getComments()
            const newComment = { _id: uniqid(), ...req.body, movieId: req.params.movieId, createdAT: new Date() }

            comments.push(newComment)

            await writeComments(comments)
            res.status(201).send(newComment)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})


commentsRouter.get("/", async (req, res, next) => {
    try {
        const comments = await getComments()
        res.send(comments)

    } catch (error) {
        console.log(error);
        next(error)
    }
})

commentsRouter.get("/:movieId", async (req, res, next) => {
    try {
        const movies = await getMovies()
        const movie = movies.find(movie => movie._id === req.params.movieId)
        if (movie) {
            const comments = await getComments()
            const filteredComments = comments.filter(comment => comment.movieId === req.params.movieId)

            res.send(filteredComments)
        } else {
            next(createError(404, `movie with id: ${req.params.movieId} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }

})

commentsRouter.delete("/:commentId"), async (req, res, next) => {
    try {
        const comments = getComments()
        const comment = comments.find(comment => comment._id === req.params.commentId)
        const remainingComments = comments.filter(comment => comment._id !== req.params.commentId)
        remainingComments.push(comment)
        writeComments(remainingComments)
        res.status(204).send("Comment with id" + req.params.commentId + "is deleted")

    } catch (error) {

    }
}



export default commentsRouter