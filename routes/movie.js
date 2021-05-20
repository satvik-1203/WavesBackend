const express = require("express");
const Mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");

const route = express.Router();

const genreSchema = new Mongoose.Schema({
  name: {
    type: String,
  },
});

const movieSchema = new Mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  genres: [genreSchema],
  date: {
    type: Date,
    default: Date.now(),
  },
  rentals: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    require: true,
  },
});

const movieJoiSchema = Joi.object({
  name: Joi.string().required(),
  genres: Joi.array(),
  date: Joi.date(),
  price: Joi.number().required(),
});

const Movie = Mongoose.model("Movie", movieSchema);

route.get("/", async (req, res) => {
  const movies = await Movie.find().sort({ name: 1 });
  res.send(movies);
});

route.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  res.send(movie);
});

route.post("/", async (req, res) => {
  const { error } = movieJoiSchema.validate(req.body);
  if (error?.details) {
    error.details.forEach((message) => res.send(message.message));
    res.status(400);
    return;
  }
  try {
    const movie = new Movie(req.body);
    const result = await movie.save();
    res.send(_.pick(result, ["name", "genres", "price"]));
  } catch (err) {
    res.status(400).send("Couldn't add account");
  }
});

module.exports = route;
