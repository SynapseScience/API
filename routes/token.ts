import { newToken } from "../functions/token";
import Application from "../models/Application";

export const run = (app, CODES: { [key: string]: string }) => {
  
  app.get("/api/token", async (req, res) => {
    
    let code = req.body.code;
    
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
    const client = Application.findOne({ client_id: clientId });

    if(!clientId || !client) {
      return res.status(401).send({
        message: "Invalid client credentials"
      });
    }

    const token = newToken(username, code, appSignature);
    delete CODES[code];

    res.json({
      token
    });
    
  });
  
};