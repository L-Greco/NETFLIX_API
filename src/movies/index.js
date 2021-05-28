import express from "express"
import uniqid from "uniqid"
import createError from "http-errors"
import { validationResult } from "express-validator"
import { moviesValidation } from "./validation.js"
import { getComments, getMovies, writeMovies } from "../library/fs-tools.js"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"



const moviesRouter = express.Router()


moviesRouter.post("/", moviesValidation, async (req, res, next) => {

    try {


        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            next(createError(400, { errorList: errors }))

        } else {
            const comments = getComments()
            const newMovie = { _id: uniqid(), ...req.body, poster: "No image uploaded yet :/", createdAT: new Date(), }

            const movies = await getMovies()
            movies.push(newMovie)

            await writeMovies(movies)
            res.status(201).send(newMovie)
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
})



moviesRouter.get("/", async (req, res, next) => {
    try {
        const movies = await getMovies()
        res.send(movies)

    } catch (error) {
        console.log(error);
        next(error)
    }
})

moviesRouter.get("/:movieId", async (req, res, next) => {
    try {

        const movies = await getMovies()
        const movie = movies.find(movie => movie._id === req.params.movieId)
        if (movie) {
            res.send(movie)
        } else {
            next(createError(404, `movie with id: ${req.params.movieId} not found!`))
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
})



moviesRouter.put("/:movieId", moviesValidation, async (req, res, next) => {
    const errors = validationResult(req)
    console.log(errors)
    if (!errors.isEmpty()) {
        next(createError(400, { errorList: errors }))

    } else {
        try {
            const movies = await getMovies()
            const movie = movies.find(movie => movie._id === req.params.movieId)
            if (movie) {
                const remainingMovies = movies.filter(movie => movie._id !== req.params.movieId)
                const editedMovie = { _id: req.params.movieId, ...req.body, updatedAt: new Date() }
                remainingMovies.push(editedMovie)
                await writeMovies(remainingMovies)
                res.send(editedMovie)
            } else {
                next(createError(404, `movie with id: ${req.params.movieId} not found!`))
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

})

const { CLOUDINARY_NAME, CLOUDINARY_KEY, CLOUDINARY_SECRET } = process.env
cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_KEY,
    api_secret: CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,

});
moviesRouter.post("/:movieId/poster", multer({ storage }).single("poster"), async (req, res, next) => {
    try {
        const movies = await getMovies()
        const movie = movies.find(movie => movie._id === req.params.movieId)
        if (movie) {

            const updatedmovie = { ...movie, poster: req.file.path, updatedAt: new Date() }
            const remainingmovies = movies.filter(movie => movie._id !== req.params.movieId)
            remainingmovies.push(updatedmovie)
            await writeMovies(remainingmovies)
            res.send(req.file)
        } else {
            next(createError(404, `movie with id: ${req.params.movieId} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }


})


moviesRouter.delete("/:movieId", async (req, res, next) => {
    try {
        const movies = await getMovies()
        const movie = movies.find(movie => movie._id === req.params.movieId)
        if (movie) {
            const remainingmovies = movies.filter(movie => movie._id !== req.params.movieId)
            await writeMovies(remainingmovies)
            res.status(204).send()
        } else {
            next(createError(404, `movie with id: ${req.params.movieId} not found!`))
        }
    } catch (error) {
        console.log(error);
        next(error)
    }
})

export default moviesRouter