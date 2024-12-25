import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";

export default (requiredPermissions: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token is required" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        username: string;
        code: string; 
        aud: string 
      };

      if (!decoded || !decoded.aud) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const clientId = decoded.aud.split(':')[0]
      const application = await Application.findOne({ client_id: clientId });
      
      if(!application) {
        return res.status(403).json({ message: "Token signed by unknown Application"})
      }
      
      const hasPermissions = requiredPermissions.every(permission => {
        return application.permissions.includes(permission);
      });

      if (!hasPermissions) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      req.clientId = clientId;
      req.username = decoded.username;

      next();
      
    } catch (err) {
      
      console.error(err);
      res.status(403).json({ message: "Invalid or expired token" });
      
    }
  };
};
