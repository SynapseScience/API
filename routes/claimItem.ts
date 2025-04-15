import User from "../models/User";
import Application from "../models/Application";
import express from "express";
import authenticate from "../middleware/authenticate";
import Item from "../models/Item";

export const run = (app): void => {

  app.post("/give", authenticate(["economy"]), 
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

      if(!req.query.item_id) return res.status(400).json({
        message: `Item id query parameter is required`
      });

      const item = await Item.findOne({ item_id: req.query.item_id });

      if(!item) return res.status(404).json({
        message: `Item not found with id : '${req.query.item_id}'`
      });

      if(user.account < item.cost) return res.status(402).json({
        message: "Insufficient User balance"
      })
      
      user.account -= item.cost;
      
      if(item.badge) {
        user.badges.push(item.badge);
      }

      item.claimed.push(user.username);

      await user.save();
      await item.save();

      res.status(200).json({ 
        message: "Item and User successfully updated", 
        user,
        item
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