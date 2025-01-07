import express from "express";
import { rString } from "../functions/random";
import bcrypt from "bcrypt";
import User from "../models/User";

export const run = (app: any, CODES: { [key: string]: string }) => {
  
  app.post("/login", async (req: express.Request, res: express.Response) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const code = rString(20);
      CODES[code] = username;
      
      res.status(200).send({ code });

    } catch(err) {

      console.error(err);
      return res.status(500).json({ message: "Internal server error" });

    }
  });
  
};