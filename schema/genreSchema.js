const Mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = Mongoose.Schema({
  name: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now() },
});

const genreJoiSchema = Joi.object({
  name: Joi.string().required().min(3),
});

module.exports.genreJoiSchema = genreJoiSchema;
module.exports.genreSchema = genreSchema;
