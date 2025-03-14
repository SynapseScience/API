import { newToken } from "../../functions/token";
import Application from "../../models/Application";
import bcrypt from "bcrypt";

export const run = (app, CODES: { [key: string]: string }) => {
  app.post("/api/token", async (req, res) => {
    try {
      
      let grant_type = req.query.grant_type;
      
      if(grant_type != "authorization_code") {
        return res.status(400).json({
          message: "Param `grant_type` needs to be set to `authorization_code`"
        })
      }

      let code = req.query.code;
      
      if (!code || !CODES[code]) {
        return res.status(401).json({
          message: "Invalid or expired exchange code",
        });
      }

      const username = CODES[code];

      let authenticator = req.headers.authorization;
      if (!authenticator)
        return res.status(400).json({
          message: "No client credentials",
        });

      let appSignature = authenticator.replace("Basic ", "");

      if (!appSignature || appSignature.length == 0) {
        return res.status(400).json({
          message: "No client credentials",
        });
      }
      
      const decoded = Buffer.from(appSignature, 'base64').toString('utf-8');
      const [clientId, clientSecret] = decoded.split(":");
      
      const client = await Application.findOne({ client_id: clientId });

      if (!clientId || !client) {
        return res.status(401).json({
          message: "Invalid client id",
        });
      }

      if(clientSecret) {
        const isMatch = await bcrypt.compare(clientSecret, client.client_secret);
        if(!isMatch) return res.status(401).json({
          message: "Invalid client secret",
        });

      } else return res.status(401).json({
        message: "No client secret provided",
      });

      const token = newToken(username, code, decoded);
      delete CODES[code];

      res.json({
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600,
        scope: client.permissions.join(" "),
      });
      
    } catch(err) {
    
      console.error(err);
      return res.status(500).json({
        message: "Internal server error",
      });
    
    }
    
  });
};