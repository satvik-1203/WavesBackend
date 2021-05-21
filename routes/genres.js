const express = require("express");
const Mongoose = require("mongoose");
const route = express.Router();

//schemas

const { genreJoiSchema, genreSchema } = require("../schema/genreSchema");
const Genre = Mongoose.model("Genre", genreSchema);

//auth module
const auth = require("../middlewares/auth");

route.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort({ name: 1 });
    res.send(genres);
  } catch {
    res.status(502).send("Failed to get the genres");
  }
});

route.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.find({ _id: req.params.id });

    res.send(genre);
  } catch {
    res.status(502).send("Failed to get the genre");
  }
});

route.post("/", auth, async (req, res) => {
  try {
    const { error } = genreJoiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre(req.body);
    const result = await genre.save();

    res.send(result);
  } catch (err) {
    if (({ keyPattern } = err)) {
      return res.status(400).send("Genre already exist");
    }
    console.log(err);
    res.status(400).send("Something went wrong");
  }
});

route.put("/:id", async (req, res) => {
  try {
    const { error } = genreJoiSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await Genre.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    res.send(result);
  } catch {
    res.status(400).send("Couldn't resolve the put request");
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const result = await Genre.findByIdAndDelete(req.params.id);
    res.send(result);
  } catch {
    res.status(400).send("Couldn't find the genre");
  }
});

module.exports = route;

// GET, PUT, POST, DELETE
