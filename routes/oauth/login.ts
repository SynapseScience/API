import express from "express";
import { rString } from "../../functions/random";
import bcrypt from "bcrypt";
import User from "../../models/User";
import cors from "../../middleware/cors";

export const run = (app: any, CODES: { [key: string]: string }) => {
  
  app.post("/oauth/login", cors(), async (req: express.Request, res: express.Response) => {
    try {
      const { username, password } = req.body;
      if(!username || !password) return res.status(400).json({
        message: "Missing required credentials"
      })
      
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ 
          message: "Invalid credentials" 
        });
      }

      const code = rString(20);
      CODES[code] = username;
      
      res.status(200).json({ code });

    } catch(err) {

      console.error(err);
      return res.status(500).json({ 
        message: "Internal server error" 
      });

    }
  });
  
};