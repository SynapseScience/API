import User from "../models/User";
import express from "express";
import authenticate from "../middleware/authenticate";

export const run = (app): void => {

  app.get("/api/me", authenticate(), async (req: express.Request, res: express.Response) => {
    try {
      const username = req.username;
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