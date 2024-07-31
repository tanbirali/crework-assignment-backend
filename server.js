const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const connection = require("./db/connection");
app.use(cors());
app.use(express.json());

const authRouter = require("./routes/user");
const getBoardRoute = require("./routes/task");
const createCardRoute = require("./routes/task");
const reorderCardRoute = require("./routes/task");
const moveCardRoute = require("./routes/task");
const deleteCardRoute = require("./routes/task");
app.get("/", (req, res) => {
  res.status(200).json("Hello server is working ");
});

app.use("/api/auth/", authRouter);
// Card Route
app.use("/api/", getBoardRoute);
app.use("/api/", createCardRoute);
app.use("/api/", reorderCardRoute);
app.use("/api/", moveCardRoute);
app.use("/api/", deleteCardRoute);

const port = process.env.PORT ? process.env.PORT : 8090;

connection.once("connected", () => {
  console.log("Mongo Db Connected");
  app.listen(port, () => {
    console.log(`Server is running at ${port}`);
  });
});
