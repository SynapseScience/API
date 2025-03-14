import User from "../models/User";
import Application from "../models/Application";
import express from "express";
import authenticate from "../middleware/authenticate";

export const run = (app): void => {

  app.put("/like", authenticate(["social"]), 
    async (req: express.Request, res: express.Response) => {
    try {
      
      let user = await User.findOne({ username: req.username });
      let application = await Application.findOne({ 
        client_id: req.query.client_id 
      });
      
      if(!application || !user) {
        return res.status(404).json({ message: "Application not found" });
      }

      user = await user.publicFields();
      application = await application.publicFields();

      // user unlike App
      if(user?.starred.includes(application.client_id)) {
        application.stargazers = application.stargazers.filter(username => {
          return username !== user.username
        });
        user.starred = user.starred.filter(id => id !== application.client_id);
      } else {
        application.stargazers.push(user.username);
        user.starred.push(application.client_id);
      }

      await user.save();
      await application.save();

      res.status(200).json({ 
        message: "Application and User successfully updated", 
        user,
        application
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