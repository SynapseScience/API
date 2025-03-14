import Application from "../models/Application";
import express from "express";

export const run = (app: any): void => {

  app.get("/application", async (req: express.Request, res: express.Response) => {
    try {
      const client_id = req.query.client_id as string;

      if (!client_id) {
        return res.status(400).json({ 
          message: "Username query parameter is required" 
        });
      }

      let application = await Application.findOne({
        client_id 
      });

      if (!application) {
        return res.status(404).json({ 
          message: "Application not found" 
        });
      }

      application = await application.publicFields();

      res.status(200).json(application);

    } catch (err) {

      console.error(err);
      res.status(500).json({ 
        message: "Internal server error" 
      });

    }
  });

};