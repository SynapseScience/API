import User from "../utils/User";
import express from "express";

export const run = (app): void => {
  
  app.get("/api/user", async (req: express.Request, res: express.Response) => {
    try {
      const username = req.query.username as string;

      if (!username) {
        return res.status(400).json({ message: "Username query parameter is required" });
      }

      const user = await User.findOne({ username }).select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
      
    } catch (err) {
      
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
      
    }
  });
  
};