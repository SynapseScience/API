import express from "express";
import Mission from "../models/Mission";

export const run = (app: any): void => {
  app.get("/missions", 
    async (req: express.Request, res: express.Response) => {
    try {

      const limit = parseInt(req.query.limit as string, 10) || 10;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      if (limit <= 0 || limit > 50 || offset < 0) {
        return res.status(400).json({ 
          message: "Invalid limit or offset values" 
        });
      }

      const query: Record<string, any> = {};

      if (req.query.application) {
        query.application = req.query.application;
      }

      if (req.query.search) {
        query.title = { 
          $regex: req.query.search, 
          $options: "i" 
        };
      }
      
      const sortQuery = req.query.sort as string || "newest";
      const sortOptions: Record<string, any> = {
        "newest": { creation: -1 },
        "oldest": { creation: 1 },
        "reward": { reward: -1 },
        "reverse-reward": { reward: 1 },
      };

      const missions = await Mission.aggregate([
        { $match: query },
        { $sort: sortOptions[sortQuery] || { creation: -1 } },
        { $skip: offset },
        { $limit: limit }
      ]);

      const total = await Mission.countDocuments(query);

      res.json({
        missions,
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
