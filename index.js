const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const userRouter = require("./routes/user.routes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/user", userRouter);

app.use("/", (req, res) => {
  res.send("Home Route");
});

app.listen(8080, async () => {
  try {
    await connection;
    console.log("connected to DB");
  } catch (err) {
    console.log(err);
  }
  console.log("Server Started at Port 8080");
});
