import express from "express";

export default function logger() {
  return (
    req: express.Request, 
    res: express.Response, 
    next: express.NextFunction) => {
      
    console.log(`${req.method} ${req.url}`);

    next();
  };
}