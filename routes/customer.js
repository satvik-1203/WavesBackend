const express = require("express");
const mongoose = require("mongoose");
const {
  customerJoiSchema,
  customerSchema,
} = require("../schema/customerSchema");
const route = express.Router();
const Customer = mongoose.model("Customer", customerSchema);

route.get("/", async (req, res) => {
  try {
    const results = await Customer.find().sort({ name: 1 });
    res.send(results);
  } catch (err) {
    res.status(502).send("Couldn't get the data");
  }
});

route.get("/:id", async (req, res) => {
  try {
    const result = await Customer.findById(req.params.id);
    if (!result) return res.send("No user with the ID ");
    res.send(result);
  } catch (err) {
    res.status(502).send("Time out");
  }
});

route.post("/", async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const { error } = customerJoiSchema.validate(req.body);
    const errors = [];

    if (error?.details) {
      error.details.forEach((message) => errors.push(message.message));
      res.status(400).send(errors);
      return;
    }

    const result = await customer.save();
    res.send(result);
  } catch (err) {
    if (({ keyPattern } = err)) {
      return res.status(400).send("Email already exist");
    }
    console.log(err);
    res.status(502).send("couldn't make the customer");
  }
});

route.put("/:id", async (req, res) => {
  try {
    const { error } = customerJoiSchema.validate(req.body);
    if (error?.details)
      return error.details.forEach((message) =>
        res.status(400).send(message.message)
      );
    const result = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
        },
      },
      { new: true }
    );
    if (!result) return res.status(400).send("Couldn't find the Id");
    res.send(result);
  } catch (err) {
    res.status(502).send("Couldn't find the Id");
  }
});

route.delete("/:id", async (req, res) => {
  try {
    const result = await Customer.findOneAndDelete(req.param.id);
    res.send(result);
  } catch (err) {
    res.status(400).send("Couldn't find the Id");
  }
});

module.exports = route;
