import express from "express";
import bcrypt from "bcrypt";
import Application from "../models/Application";
import authenticate from "../middleware/authenticate";
import { rString } from "../functions/random";
import User from "../models/User";

export const run = (app: any) => {

  app.post("/api/application", authenticate(["manage_apps"]), 
    async (req: express.Request, res: express.Response) => {
    try {

      const user = await User.findOne({ username: req.username })
      
      const { 
        client_id,
        title,
        description,
        link,
        type,
        tags,
        uris
      } = req.body;

      if(!uris || uris.length > 5 || uris.length < 1) {
        return res.status(400).json({ 
          message: "Number of URIs should be in [1-5]" 
        });
      }

      const existingId = await Application.findOne({ client_id });
      if(existingId) {
        return res.status(400).json({ 
          message: "Application client_id already exists" 
        });
      }
      
      const secret = rString(30);
      const hashedSecret = await bcrypt.hash(secret, 10);

      const newApp = new Application({
        client_secret: hashedSecret,
        client_id: client_id.toLowerCase(),
        title,
        description,
        link,
        authors: [user.username],
        type,
        tags,
        uris
      });

      user.applications.push(client_id)

      await newApp.save();
      await user.save();

      res.status(201).json({ 
        message: "Application succesfully registered",
        client_secret: secret
      });

    } catch (err) {

      if (err.name === "ValidationError") {
        const errors = Object.values(err.errors)
          .map((e: any) => e.message);
        return res.status(400).json({ 
          message: "Validation error on user-defined fields",
          errors 
        });
      }

      console.error(err);
      return res.status(500).json({ 
        message: "Internal server error" 
      });

    }
  });

}