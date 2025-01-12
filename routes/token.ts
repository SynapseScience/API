import { newToken } from "../functions/token";
import Application from "../models/Application";
import bcrypt from "bcrypt";

export const run = (app, CODES: { [key: string]: string }) => {
  
  app.get("/api/token", async (req, res) => {

    let code = req.query.code;
    
    if (!code || !CODES[code]) {
      return res.status(401).send({
        message: "Invalid or expired exchange code"
      });
    }

    const username = CODES[code];

    let authenticator = req.headers.authorization;
    if (!authenticator) return res.status(400).send({
      message: "No client credentials"
    });

    let appSignature = authenticator.replace("Basic ", "");
    
    if (!appSignature || appSignature.length == 0) {
      return res.status(400).send({
        message: "No client credentials"
      });
    }

    const clientId = appSignature.split(':')[0];
    const client = await Application.findOne({ client_id: clientId });

    if(!clientId || !client) {
      return res.status(401).send({
        message: "Invalid client id"
      });
    }

    const clientSecret = appSignature.split(':')[1];
    const isMatch = await bcrypt.compare(clientSecret, client.client_secret);
    
    if(!clientSecret || !isMatch) {
      return res.status(401).send({
        message: "Invalid client secret"
      });
    }

    const token = newToken(username, code, appSignature);
    delete CODES[code];

    res.json({
      token
    });
    
  });
  
};