import express from "express";
import { rString } from "../functions/random";
import bcrypt from "bcrypt";
import User from "../models/User";

export const run = (app, CODES) => {
  
  app.post("/register", async (req: express.Request, res: express.Response) => {
    try {
      const { username, password, fullname, email } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username,
        fullname,
        email,
        password: hashedPassword,
      });

      await newUser.save();

      const code = rString(20);
      CODES[username] = code;

      res.status(201).send({ code });

    } catch (err) {

      console.error(err);
      return res.status(500).json({ message: "Internal server error" });

    }
  });
  
}