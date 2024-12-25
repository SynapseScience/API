const SYNAPSE_API_HOSTNAME =
  "https://c922b0b4-faa7-4843-a36a-5d117f94fbe2-00-2rvq4synzbykl.janeway.replit.dev/api";

import fetch from "node-fetch";
import express from "express";

export default function synapse(client_id: string, client_secret: string) {
  const app = express();

  const authenticator = `${client_id}:${client_secret}`;

  app.use(
    "/synapse-exchange-code",
    async (req: express.Request, res: express.Response) => {
      let code = req.query.code;
      let username = req.query.username;

      const url =
        SYNAPSE_API_HOSTNAME + `/token?code=${code}&username=${username}`;
      let response = await fetch(url, {
        headers: {
          Authorization: `Basic ${authenticator}`,
        },
      });

      if (response.status == 200) {
        let token = await response.json();
        res.status(200).json(token);
      } else {
        res.status(response.status).send(response.statusText);
      }
    },
  );

  app.use("/synapse-me", forward("/me"));

  return app;
}

function forward(endpoint: string) {
  return async (req: express.Request, res: express.Response) => {
    let response = await fetch(SYNAPSE_API_HOSTNAME + endpoint, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    let data = await response.json();
    res.status(response.status).json(data);
  };
}