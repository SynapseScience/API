import { newToken } from "../functions/token";

export const run = (app, CODES) => {
  
  app.get("/api/token", async (req, res) => {
    
    let code = req.query.code;
    let username = req.query.username;

    if (!code || !username) {
      return res.status(400).send({
        message: "No code or username provided"
      });
    }
    
    if (!CODES[username] || CODES[username] !== code) {
      return res.status(401).send({
        message: "Invalid exchange code"
      });
    }

    let authenticator = req.headers.authorization;
    if (!authenticator) return res.status(400).send({
      message: "No client credentials"
    });

    let appSignature = authenticator.replace("Basic ", "");
    
    if (!appSignature || appSignature.length == 0) {
      return res.status(401).send({
        message: "Invalid client credentials"
      });
    }

    res.json({
      token: newToken(username, code, appSignature)
    });
    
  });
  
};