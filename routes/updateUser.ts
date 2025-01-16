import express from "express";
import User from "../models/User";
import authenticate from "../middleware/authenticate";

export const run = (app: any) => {
  
  app.put("/api/user", authenticate(["edition"]), 
    async (req: express.Request, res: express.Response) => {
      
    try {
      const {
        fullname,
        pronouns,
        description,
        connections,
        avatar
      } = req.body;

      const user = await User.findOne({ username: req.username })
        .select(User.getPublicFields());

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fullname) user.fullname = fullname;
      if (pronouns) user.pronouns = pronouns;
      if (description) user.description = description;
      if (connections) user.connections = connections;
      if (avatar) user.avatar = avatar;

      await user.save();

      return res.status(200).json({ 
        message: "User updated successfully", 
        user
      });

    } catch (err) {
      
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
      
    }
  });
  
};