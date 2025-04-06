import Application from "../models/Application";
import express from "express";

type IApp = {
  stargazers: string[];
}

export const run = (app: any): void => {
  app.get("/applications", 
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
      query.verified = true;

      if (req.query.author) {
        query.authors = req.query.author;
      }

      if (req.query.search) {
        query.title = { 
          $regex: req.query.search, 
          $options: "i" 
        };
      }

      if (req.query.tags) {
        let tags = (req.query.tags as string).split(",");
        query.tags = { $all: tags };
      }

      const sortQuery = req.query.sort as string || "newest";
      const sortOptions: Record<string, any> = {
        "newest": { creation: -1 },
        "oldest": { creation: 1 },
        "popular": { stars: -1 },
        "reverse-popular": { stars: 1 },
      };

      if (req.query.type) {
        let type = (req.query.type as string).split(",");
        query.type = { $in: type };
      }

      const applications = await Application.aggregate([
        { $match: query },
        { 
          $addFields: { 
            stars: { $size: { $ifNull: ["$stargazers", []] } }
          } 
        },
        { $sort: sortOptions[sortQuery] || { creation: -1 } },
        { $skip: offset },
        { $limit: limit }
      ]);

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
