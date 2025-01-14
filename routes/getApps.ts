import Application from "../models/Application";
import express from "express";

export const run = (app: any): void => {

  app.get("/api/applications", async (req: express.Request, res: express.Response) => {

    try {

      const limit = parseInt(req.query.limit, 10) || 10;
      const offset = parseInt(req.query.offset, 10) || 0;

      if (limit <= 0 || limit > 50 || offset < 0) {
        return res.status(400).json({ 
          message: "Invalid limit or offset values"
        });
      }

      const applications = await Application.find()
        .skip(offset)
        .limit(limit)
        .lean()
        .exec();

      const publicApplications = await Promise.all(
        applications.map(async (app) => {
          const docApp = await Application.findOne({ client_id: app.client_id });
          const publicApp = await docApp.publicFields();
          console.log(publicApp)
          return publicApp;
        })
      );

      const total = await Application.countDocuments();

      res.json({
        applications: publicApplications,
        pagination: {
          total,
          limit,
          offset,
          currentPage: Math.floor(offset / limit) + 1,
          totalPages: Math.ceil(total / limit),
        },
      });
      
    } catch (err) {
      
      console.error(err);
      res.status(500).json({ 
        message: "Internal server error" 
      });
      
    }
      
  });

};