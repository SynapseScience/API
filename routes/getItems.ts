import express from "express";
import Item from "../models/Item";

export const run = (app: any): void => {
  app.get("/items", 
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
        "value": { value: -1 },
        "reverse-value": { value: 1 },
      };

      const items = await Item.aggregate([
        { $match: query },
        { $sort: sortOptions[sortQuery] || { creation: -1 } },
        { $skip: offset },
        { $limit: limit }
      ]);

      const total = await Item.countDocuments(query);

      res.json({
        items,
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
