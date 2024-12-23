import { newToken } from "../utils/token";

export const run = (app) => {
  
  app.get("/api/token", async (req, res) => {
    
    let code = req.query.code;
    let username = req.query.username;

    if (!code || !username) {
      return res.status(400).send("No code or username provided");
    }
    
    if (!app.tokens[username] || app.tokens[username].code !== code) {
      return res.status(401).send("Invalid exchange code");
    }

    let authenticator = req.headers.authorization;
    if (!authenticator) return res.status(400).send("No client credentials");

    let signature = authenticator.replace("Basic ", "");
    
    if (!signature || signature.length == 0) {
      return res.status(401).send("Invalid client credentials");
    }

    res.json(newToken(code, signature));
    
  });
  
};