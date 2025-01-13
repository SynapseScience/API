import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Server connected to MongoDB");
});

const app = express();

app.use(cors());
app.use(express.json())


app.use("/", express.static("reference"));
app.use("/assets", express.static("assets"));
app.use("/oauth", express.static("oauth"));
app.use("/dist", express.static("dist"));

let CODES = {};

for(let endpoint of fs.readdirSync('./routes')) {
  let { run } = await import(`./routes/${endpoint}`);
  run(app, CODES);
}

app.listen(8080, () => {
  console.log(`Server listening to port ${8080}`);
});