import User from "../models/User";
import express from "express";

export const run = (app: any): void => {
  
  app.get("/user", async (req: express.Request, res: express.Response) => {
    try {
      const username = req.query.username as string;

      if (!username) {
        return res.status(400).json({ 
          message: "Username query parameter is required" 
        });
      }

      let user = await User.findOne({
        username 
      });

      if (!user) {
        return res.status(404).json({ 
          message: "User not found" 
        });
      }

      user = await user.publicFields();

      res.status(200).json(user);
      
    } catch (err) {
      
      console.error(err);
      res.status(500).json({ 
        message: "Internal server error" 
      });
      
    }
  });
  
};