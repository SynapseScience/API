import express from "express";
import cors from "cors";
import fs from "fs";
import synapse from './utils/synapse';
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Server connected to MongoDB");
});

const app = synapse("synapse-auth", process.env.SYNAPSE_KEY);

app.use(cors());
app.use(express.json())

app.use("/auth", express.static("auth"));
app.use("/dist", express.static("dist"));

for(let endpoint of fs.readdirSync('./api')) {
  let { run } = await import(`./api/${endpoint}`);
  run(app);
}

app.listen(8080, () => {
  console.log(`Server listening to port ${8080}`);
});