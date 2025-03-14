import authenticate from "../middleware/authenticate";
import Application from "../models/Application";
import User from "../models/User";
import express from "express";

export const run = (app: any): void => {
  app.get("/drafts", authenticate(), async (req: express.Request, res: express.Response) => {
    try {
      
      const query: Record<string, any> = {};
      query.authors = req.username;

      const applications = await Application.find(query)
        .lean()
        .exec();

      const publicApplications = await Promise.all(
        applications.map(async (app) => {
          const docApp = await Application.findOne({ client_id: app.client_id });
          return await docApp.publicFields();
        })
      );

      res.json(publicApplications);

    } catch (err) {

      console.error(err);
      res.status(500).json({ 
        message: "Internal server error" 
      });

    }
  });
};