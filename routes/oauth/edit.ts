import express from "express";
import User from "../../models/User";
import bcrypt from "bcrypt";
import cors from "../../middleware/cors";

export const run = (app: any, CODES: { [key: string]: string }) => {

  app.put("/oauth/reset", cors(), 
    async (req: express.Request, res: express.Response) => {
      try {
        
        const password = req.body.email as string;
        if(!password) return res.status(400).json({
          message: "No password provided"
        })
  
        const username = req.body.username as string;
        if(!username) return res.status(400).json({
          message: "No username provided"
        })
  
        const code = req.body.code as string;
        if(!code) return res.status(400).json({
          message: "No security code provided"
        })
  
        let user = await User.findOne({ username });
  
        if(user) {
          if(!CODES[code] || CODES[code] != username) {
            return res.status(401).json({
              message: "Invalid security code"
            })
          }
  
          user.password = await bcrypt.hash(password, 10);
          await user.save();
  
          return res.status(200).json({
            message: "New password successfully set"
          })
          
        } else return res.status(400).json({
          message: `User not found with username : ${username}`
        })

      } catch (err) {
        
        console.error(err);
        res.status(500).json({
          message: "Internal server error"
        });
        
      }
    }
  )

};