const express = require("express");
const Users = require("./users/model");
const server = express();
server.use(express.json());

server.post("/api/users", async (req, res) => {
  const user = req.body;

  if (!user.name || !user.bio) {
    return res
      .status(400)
      .json({ message: "Please provide name and bio for the user" });
  }

  try {
    const createdUser = await Users.insert(user);
    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).json({
      message: "There was an error while saving the user to the database",
      err: err.message,
      stack: err.stack,
    });
  }
});

server.get("/api/users", async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The users information could not be retrieved" });
  }
});

server.get("/api/users/:id", async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user) {
      res
        .status(404)
        .json({ message: "The user with the specified ID does not exist" });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "The users information could not be retrieved" });
  }
});

server.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "The user with the specified ID does not exist" });
    }

    await Users.remove(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "The user could not be removed",
      err: err.message,
      stack: err.stack,
    });
  }
});

server.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const changes = req.body;

  if (!changes.name || !changes.bio) {
    return res.status(400).json({ message: "Please provide name and bio for the user" });
  }

  try {
    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ message: "The user with the specified ID does not exist" });
    }

    const updatedUser = await Users.update(id, changes);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: "The user information could not be modified",
      err: err.message,
      stack: err.stack,
    });
  }
});

module.exports = server;
