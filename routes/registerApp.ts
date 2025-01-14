import express from "express";
import bcrypt from "bcrypt";
import Application from "../models/Application";
import authenticate from "../middleware/authenticate";
import { rString } from "../functions/random";

export const run = (app: any) => {

  app.post("/api/applications", authenticate(["manage_apps"]), 
    async (req: express.Request, res: express.Response) => {
    try {
      const { 
        client_id,
        title,
        description,
        link
      } = req.body;

      const existingId = await Application.findOne({ client_id });
      if(existingId) {
        return res.status(400).json({ 
          message: "Application client_id already exists" 
        });
      }

      const secret = rString(30);
      const hashedSecret = await bcrypt.hash(secret, 10);

      const newUser = new Application({
        client_secret: hashedSecret,
        client_id,
        title,
        description,
        link
      });

      await newUser.save();

      res.status(201).send({ 
        message: "Application succesfully registered",
        client_secret: secret
      });

    } catch (err) {

      console.error(err);
      return res.status(500).json({ 
        message: "Internal server error" 
      });

    }
  });

}