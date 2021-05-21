const express = require("express");
const genres = require("./routes/genres");
const customer = require("./routes/customer");
const login = require("./routes/login.js");
const movie = require("./routes/movie");
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

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["*", "content-Type"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/movies", movie);

app.use("/api/customers", customer);
app.use("/api/login", login);

app.get("/api/", (req, res) => {
  res.send(req.headers);
});

app.listen(3001, () => {
  console.log("Listening on port 3001...");
});
