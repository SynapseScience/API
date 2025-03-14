import express from "express";
import User from "../../models/User";
import authenticate from "../../middleware/authenticate";
import mailer from "../../functions/mailer";
import { rString } from "../../functions/random";

export const run = (app: any, CODES) => {

  app.post("/oauth/reset", authenticate(["reset_password"]), 
    async (req: express.Request, res: express.Response) => {

      const email = req.query.email as string;
      if(!email) return res.status(400).json({
        message: "No email provided"
      })
      
      let user = await User.findOne({ email });
      
      if(user) {
        const code = rString(10);
        CODES[code] = user.username;
        
        mailer(
          email, 
          "Synapse Science - Réinitialisation du mot de passe",
          `Bonjour ! Vous avez demandé une réinitialisation de votre mot de passe Synapse. Si ce n'est pas vous, merci de contacter immédiatement le support client. Votre code pour terminer la procédure est le suivant : [ ${c} ]`
        )
        
      } else res.status(400).json({
        message: `No user was found having this email : '${email}'`
      })
    }
  )

};