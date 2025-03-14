import User from "../models/User";
import express from "express";
import authenticate from "../middleware/authenticate";

export const run = (app): void => {

  app.put("/follow", authenticate(["social"]), 
    async (req: express.Request, res: express.Response) => {
    try {
      let userA = await User.findOne({ username: req.username });
      userA = await userA.publicFields();
      let userB = await User.findOne({ username: req.query.username });
      userB = await userB.publicFields();

      if (!userA || !userB) {
        return res.status(404).json({ message: "User not found" });
      }

      // A unfollows B
      if(userB.followers.includes(req.username)) {
        userB.followers = userB.followers.filter(f => f !== req.username);
        userA.following = userA.following.filter(f => f !== req.query.username);
      } else { // A follows B
        userB.followers.push(req.username);
        userA.following.push(req.query.username);
      }

      await userA.save();
      await userB.save();

      res.status(200).json({ 
        message: "User successfully updated", 
        user: userA,
        userB
      })

    } catch (err) {

      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((e: any) => e.message);
        return res.status(400).json({ 
          message: "Validation error on user-defined fields",
          errors 
        });
      }

      console.error(err);
      res.status(500).json({ message: "Internal server error" });

    }
  });

};