import express from "express";
import cors from "cors";
import fs from "fs";
import synapse from './functions/synapse';
import mongoose from "mongoose";
import path from "path";

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Server connected to MongoDB");
});

const app = synapse("synapse-auth", process.env.SYNAPSE_KEY);

app.use(cors());
app.use(express.json())


app.use("/", express.static("reference"));
app.use("/assets", express.static("assets"));
app.use("/auth", express.static("auth"));
app.use("/dist", express.static("dist"));

let CODES = {};

for(let endpoint of fs.readdirSync('./routes')) {
  let { run } = await import(`./routes/${endpoint}`);
  run(app, CODES);
}

app.listen(8080, () => {
  console.log(`Server listening to port ${8080}`);
});