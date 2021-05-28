import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"


const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../database") // now it targets the database folder
const moviesPath = join(dataFolderPath, "movies.json")
const commentsPath = join(dataFolderPath, "comments.json")

// GET
export const getMovies = async () => await readJSON(moviesPath)
export const getComments = async () => await readJSON(commentsPath)

// WRITE
export const writeMovies = async (content) => await writeJSON(moviesPath, content)
export const writeComments = async (content) => await writeJSON(commentsPath, content)

// WRITE PICTURES 
export const writeCommentsPictures = async (fileName, content) => await writeFile(join(commentsImg, fileName), content)
export const writeMoviesPictures = async (fileName, content) => await writeFile(join(moviesImg, fileName), content)

// STREAMS 
export const getCommentsReadStream = () => fs.createReadStream(commentsPath)
export const getMoviesReadStream = () => fs.createReadStream(moviesPath)


