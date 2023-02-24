const express = require("express");
const Users = require("./users/model");

const server = express();

server.use(express.json());

            //GET

server.get("/api/users", async (req, res) => {
    try {
        const users = await Users.find()
        res.status(200).json(users)
    } catch (err){
        res.status(500).json({message: `The users information could not be retrieved`})
    }
})

server.get("/api/users/:id", async (req,res) => {
    try{
        const { id }= req.params
        const user = await Users.findById(id)
        if (!user) {
            res.status(404).json({message:`The user with the specified ID does not exist`})
        } else {
            res.status(200).json(user)
        }
    } catch(err) {
        res.status(500).json({message: `The user information could not be retrieved`})
    }
})

            //POST

server.post('/api/users', (req, res) => {
        const user = req.body
        if(!user.name || !user.bio){
            res.status(400).json({message: "Please provide name and bio for the user"})
        } else {
            Users.insert(user)
                .then(newUser => {
                    res.status(201).json(newUser)
                })
                .catch(err => {
                    res.status(500).json({message: `There was an error while saving the user to the database`})
                })
        }     
})

            //PUT

server.put('/api/users/:id', async (req, res) => {
    try{
        const {id} = req.params
        const {name, bio} = req.body
        if (!name || !bio) {
            res.status(400).json({message: "Please provide name and bio for the user"})
        } else {
            const updatedUser = await Users.update(id, {name, bio})
            if (!updatedUser) {
                res.status(404).json({message: `The user with the specified ID does not exist`})
            } else {
                res.status(200).json(updatedUser)
            }
        }
    } catch(err){
        res.status(500).json({message: `The user information could not be modified`})
    }
})

                //DELETE

server.delete("/api/users/:id", async (req, res) => {
    try{
        const {id} = req.params
        const deletedUser = await Users.remove(id)
        if (!deletedUser || !id) {
            res.status(404).json({message: `The user with the specified ID does not exist`})
        } else {
            res.status(200).json(deletedUser)
        }
    } catch(err){
        res.status(500).json({message: "The user could not be removed"})
    }
})

server.use('*', (req, res) => {
    res.status(404).json({message: 'not found'})
})

module.exports = server;