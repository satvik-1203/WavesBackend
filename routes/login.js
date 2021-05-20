const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// schemas
const { customerSchema } = require("../schema/customerSchema");
const Customer = mongoose.model("Customer", customerSchema);

// router
const route = express.Router();

// requests

route.post("/", (req, res) => {
  const userEmail = req.body.email;
  const userPassword = req.body.password;

  try {
    if (userEmail) {
      Customer.findOne(
        {
          email: userEmail,
        },
        (err, data) => {
          if (err) {
            res.json(err);
          }

          if (data) {
            const isValid = bcrypt.compareSync(userPassword, data.password);
            if (isValid) {
              res.json(data);
            } else {
              res.status(400).json("wrong credentials");
            }
          } else {
            res.status(404).json("could not find a user with that email");
          }
        }
      );
    } else {
      res.status(400).json("Email not specified");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
