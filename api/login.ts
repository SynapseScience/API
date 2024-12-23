import express from "express";
import { rString } from "../utils/random";
import bcrypt from "bcrypt";
import User from "../utils/User";

export const run = (app: any) => {
  
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
      app.tokens[username] = {
        code,
        expire: Date.now() + 8.64e+7
      };

      res.status(200).send({ code });

    } catch(err) {

      console.error(err);
      return res.status(500).json({ message: "Internal server error" });

    }
  });
  
};