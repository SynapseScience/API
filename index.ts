import express from "express";
import cors from "cors";
import fs from "fs";
import mongoose from "mongoose";
import logger from "./middleware/logger";

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Server connected to MongoDB");
});

const app = express();

app.use(cors());
app.use(express.json())
app.use(logger())

app.use("/", express.static("reference"));
app.use("/assets", express.static("assets"));
app.use("/oauth", express.static("oauth"));
app.use("/dist", express.static("dist"));

let CODES = {};

function recFilesPaths(rootPath: string) {
  let directSubPaths = fs.readdirSync(rootPath)
    .map(path => rootPath + "/" + path);
  
  let filePaths = [];
  
  for(let subPath of directSubPaths) {
    if(fs.lstatSync(subPath).isDirectory()) {
      filePaths = filePaths.concat(recFilesPaths(subPath));
    } else filePaths.push(subPath);
  }

  return filePaths;
}

for(let endpoint of recFilesPaths("./routes")) {
  let { run } = await import(endpoint);
  run(app, CODES);
}

app.listen(8080, () => {
  console.log(`Server listening to port ${8080}`);
});