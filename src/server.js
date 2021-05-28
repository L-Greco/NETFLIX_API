import express from "express";
import cors from "cors"
import { badRequestErrorHandler, notFoundErrorHandler, forbiddenErrorHandler, catchAllErrorHandler } from "./errorHandlers.js"
import moviesRouter from "./movies/index.js";
import commentsRouter from "./comments/index.js"

const server = express()

const port = process.env.PORT || 3001

server.use(express.json())

const whiteList = [process.env.FE_ORIGIN]

const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.find(url => url === origin)) {
            callback(null, true)
        }
        else {
            const error = new Error("Cors Problems")
            error.status = 403
            callback(error)
        }

    }
}

server.use(cors(corsOptions))

// ******** ROUTES ************
server.use("/movies", moviesRouter)
server.use("/comments", commentsRouter)

// ******** ERROR MIDDLEWARES ************

server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

server.listen(port, () => { console.log("Sever listens on  http://localhost: ", port) })