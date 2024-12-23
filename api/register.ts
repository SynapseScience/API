import express from "express";
import { rString } from "../utils/random";
import bcrypt from "bcrypt";
import User from "../utils/User";

export const run = (app) => {
  
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
      app.tokens[username] = {
        code,
        expire: Date.now() + 8.64e+7
      };

      res.status(201).send({ code });

    } catch (err) {

      console.error(err);
      return res.status(500).json({ message: "Internal server error" });

    }
  });
  
}