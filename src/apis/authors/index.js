import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"


const authorRouter = express.Router()
 const usersJSONPath = join(dirname(fileURLToPath(import.meta.url)), "authors.json")
 

authorRouter.post("/", (request, response) => {
    console.log("req body", request.body)
    const newUser = {...request.body, createdAt: new Date(), id: uniqid() }
    console.log("This is a new user:", newUser)
    const users = JSON.parse(fs.readFileSync(usersJSONPath))
    users.push(newUser)
    fs.writeFileSync(usersJSONPath, JSON.stringify(users))
    response.status(201).send({id: newUser.id})
})
authorRouter.get("/", (request, response) => {
    const fileContent = fs.readFileSync(usersJSONPath)
    console.log("content", fileContent)
    const usersArray = JSON.parse(fileContent)
    console.log("this is the content as a json: ", usersArray)
    response.send(usersArray)
 })
authorRouter.get("/:userId", (request, response) => {
    const userID = request.params.userId
    console.log("this is the user ID:", userID)
    const users = JSON.parse(fs.readFileSync(usersJSONPath))
    const theFoundUser = users.find(user => user.id === userID)
    response.send(theFoundUser)
})
authorRouter.put("/:userId", (request, response) => {
    const users = JSON.parse(fs.readFileSync(usersJSONPath))
    const index = users.findIndex(user => user.id === request.params.userId)
    const oldUser = users[index]
    const updatedUser = {...oldUser, ...request.body, updatedAt: new Date() }

    users[index] = updatedUser

    fs.writeFileSync(usersJSONPath, JSON.stringify(users))
    response.send(updatedUser)
 
})
authorRouter.delete("/:userId", (request, response) => {
    const users = JSON.parse(fs.readFileSync(usersJSONPath))
    const remainingUsers = users.filter(user => user.id !== request.params.userId)
    fs.writeFileSync(usersJSONPath, JSON.stringify(remainingUsers))
    response.status(204).send()


})


export default authorRouter




