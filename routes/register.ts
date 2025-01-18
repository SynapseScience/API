import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import cors from "../middleware/cors";
import { rString } from "../functions/random";

export const run = (app: any, CODES: { [key: string]: string }) => {
  
  app.post("/register", cors(), async (req: express.Request, res: express.Response) => {
    try {
      const { 
        password,
        username,
        fullname,
        email,
        pronouns
      } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        password: hashedPassword,
        username,
        fullname,
        email,
        pronouns
      });

      await newUser.save();

      const code = rString(20);
      CODES[code] = username;

      res.status(201).send({ message: "User succesfully created", code });

    } catch (err) {

      console.error(err);
      return res.status(500).json({ message: "Internal server error" });

    }
  });
  
}