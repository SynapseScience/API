import User from "../models/User";
import Application from "../models/Application";
import Mission from "../models/Mission";
import express from "express";
import authenticate from "../middleware/authenticate";

export const run = (app): void => {

  app.post("/claim", authenticate(["economy"]), 
    async (req: express.Request, res: express.Response) => {
    try {

      let user = await User.findOne({ username: req.username });
      let application = await Application.findOne({ 
        client_id: req.clientId
      });

      user = await user.publicFields();

      if(!user || !application) return res.status(400).json({
        message: "Cannot find authenticated User or Application"
      });

      if(!req.query.mission_id) return res.status(400).json({
        message: `Mission id query parameter is required`
      });

      const mission = await Mission.findOne({ mission_id: req.query.mission_id });

      if(!mission) return res.status(404).json({
        message: `Mission not found with id : '${req.query.mission_id}'`
      });

      if(mission.claimed.includes(user.username)) return res.status(400).json({
        message: "Mission already claimed by User"
      })
      
      user.account += mission.reward;
      mission.claimed.push(user.username);

      await user.save();
      await mission.save();

      res.status(200).json({ 
        message: "Mission and User successfully updated", 
        user,
        mission
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