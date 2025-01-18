import Application from "../models/Application";
import User from "../models/User";
import express from "express";

export const run = (app: any): void => {
  app.get("/api/applications", async (req: express.Request, res: express.Response) => {
    try {
      
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      if (limit <= 0 || limit > 50 || offset < 0) {
        return res.status(400).json({ 
          message: "Invalid limit or offset values" 
        });
      }

      const query: Record<string, any> = {};
      query.verified = true;

      if (req.query.author) {
        const user = await User.findOne({ username: req.query.author }).lean();
        if (!user) {
          return res.status(404).json({ 
            message: "User not found" 
          });
        }
        query.authors = req.query.author;
      }

      if (req.query.search) {
        query.title = { $regex: req.query.search, $options: "i" };
      }

      const applications = await Application.find(query)
        .skip(offset)
        .limit(limit)
        .lean()
        .exec();

      const publicApplications = await Promise.all(
        applications.map(async (app) => {
          const docApp = await Application.findOne({ client_id: app.client_id });
          return await docApp.publicFields();
        })
      );

      const total = await Application.countDocuments(query);

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
