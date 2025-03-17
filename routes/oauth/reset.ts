import express from "express";
import User from "../../models/User";
import mailer from "../../functions/mailer";
import { rString } from "../../functions/random";
import cors from "../../middleware/cors";

export const run = (app: any, CODES: { [key: string]: string }) => {

  app.post("/oauth/reset", cors(), 
    async (req: express.Request, res: express.Response) => {
      try {
        
        const email = req.body.email as string;
        if(!email) return res.status(400).json({
          message: "No email provided"
        })

        let user = await User.findOne({ email });

        if(user) {
          const c = rString(10);
          CODES[c] = user.username;

          mailer(
            email, 
            "Synapse Science - Réinitialisation du mot de passe",
            `Bonjour ! Vous avez demandé une réinitialisation de votre mot de passe Synapse. Si ce n'est pas vous, merci de contacter immédiatement le support client. Votre code pour terminer la procédure est le suivant : [ ${c} ]`
          )

          return res.status(200).json({
            message: "Mail successfully sent"
          })

        } else return res.status(400).json({
          message: `No user was found having this email : '${email}'`
        })
        
      } catch (err) {
        console.error(err);
        res.status(500).json({
          message: "Internal server error"
        })
      }
      
    }
  )
};