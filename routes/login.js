const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//.env import
require("dotenv").config();

// schemas
const { customerSchema } = require("../schema/customerSchema");
const Customer = mongoose.model("Customer", customerSchema);

// router
const route = express.Router();

//JWT token
const jwt = require("jsonwebtoken");

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
              //

              // adding JWT here

              //Once the user logs in, u want to send him a token so im removing the data here

              const token = jwt.sign(
                { _id: data._id, idAdmin: data.isAdmin },
                process.env.JWT_SIGN
              );

              // We are sending it thru the header so the client won't be able to see while receiving the data

              res.send({
                "x-jwt-token": token,
              });
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
