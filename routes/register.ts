import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User";

export const run = (app: any) => {
  
  app.post("/register", async (req: express.Request, res: express.Response) => {
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

      res.status(201).send({ message: "User succesfully created" });

    } catch (err) {

      console.error(err);
      return res.status(500).json({ message: "Internal server error" });

    }
  });
  
}