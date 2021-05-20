const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = mongoose.Schema({
  name: {
    required: true,
    type: String,
    min: 3,
  },
  password: {
    required: true,
    type: String,
    min: 5,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

const customerJoiSchema = Joi.object({
  name: Joi.string().required().min(3),
  password: Joi.string()
    .required()
    .min(5)
    .regex(/.*[A-Z].*/),
  email: Joi.string()
    .email({ minDomainSegments: 1, tlds: { allow: ["com", "net"] } })
    .required(),
  isAdmin: Joi.boolean(),
  isGold: Joi.boolean(),
}).options({ abortEarly: false });

module.exports.customerJoiSchema = customerJoiSchema;

module.exports.customerSchema = customerSchema;
