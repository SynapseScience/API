import express from "express";
import User from "../models/User";
import authenticate from "../middleware/authenticate";

export const run = (app: any) => {
  
  app.put("/me", authenticate(["edition"]), 
    async (req: express.Request, res: express.Response) => {
      
    try {
      const {
        fullname,
        pronouns,
        description,
        connections,
        avatar
      } = req.body;

      let user = await User.findOne({ username: req.username });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (fullname) user.fullname = fullname;
      if (pronouns) user.pronouns = pronouns;
      if (description) user.description = description;
      if (connections) user.connections = connections;
      if (avatar) user.avatar = avatar;

      await user.save();
      user = await user.publicFields();

      return res.status(200).json({ 
        message: "User updated successfully", 
        user
      });

    } catch (err) {

      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e: any) => e.message);
        return res.status(400).json({ 
          message: "Validation error on user-defined fields",
          errors 
        });
      }
      
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
      
    }
  });
  
};