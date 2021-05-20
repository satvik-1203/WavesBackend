const express = require("express");
const genres = require("./routes/genres");
const customer = require("./routes/customer");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/Movies", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => {
    console.log("Connected to mongodb...");
  })
  .catch((err) => {
    "Couldn't connect to mongodb", err;
  });
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use("/api/genres", genres);

app.use("/api/customers", customer);

app.get("/", (req, res) => {
  res.send("Connected");
});

app.listen(3001, () => {
  console.log("Listening on port 3000...");
});
