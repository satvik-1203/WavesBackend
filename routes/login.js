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
              res.status(400).json("Wrong credentials");
            }
          } else {
            res.status(404).json("Wrong credentials");
          }
        }
      );
    } else {
      res.status(400).json("Wrong credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = route;
