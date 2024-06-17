import express from "express";
import cors from "cors";
import morgan from "morgan";
import router from "./router/route.js";
import mongoose from "mongoose";

const port = 8080;

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

// http get request
app.get("/", (req, res) => {
  res.status(200).json("Home GET request!");
});

// api routes
app.use("/api", router);

// start server
mongoose.connect("mongodb+srv://duongtrungkien:duongtrungkien@cluster0.dnnugos.mongodb.net/authentication-mern?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    try {
      app.listen(port, () => {
        console.log("Server listening on port " + port + "...");
      });
      console.log("Connected Database!");
    } catch (error) {
      console.log("Cannot connect to the server");
    }
  })
  .catch((err) => {
    console.log("🚀 ~ connect ~ err:", err);
  });
