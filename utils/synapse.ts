const SYNAPSE_API_HOSTNAME = "https://c922b0b4-faa7-4843-a36a-5d117f94fbe2-00-2rvq4synzbykl.janeway.replit.dev/api"

import fetch from "node-fetch";
import express from "express";

export default function synapse(client_id: string, client_secret: string) {
  const app = express()
  
  const authenticator = Buffer.from(`${client_id}:${client_secret}`)
    .toString('base64');
  
  app.tokens = {}

  app.use('/synapse-exchange-code', async (req , res) => {
    let code = req.query.code
    let username = req.query.username
    
    let response = await fetch(SYNAPSE_API_HOSTNAME + `/token?code=${code}&username=${username}`, {
      headers: {
        "Authorization": `Basic ${authenticator}`
      }
    })

    if(response.status == 200) {
      app.tokens[username] = await response.json()
      res.status(200).send('Successfully connected')
    } else {
      res.status(response.status).send(response.statusText)
    }
  })

  app.use('/synapse-user', async (req , res) => {
    let username = req.query.username

    let response = await fetch(SYNAPSE_API_HOSTNAME + `/user?username=${username}`, {
      headers: {
        "Authorization": `Bearer ${app.tokens[username]}`
      }
    })

    if(response.status == 200) {
      let user = await response.json()
      res.json(user)
    } else {
      res.status(response.status).send(response.statusText)
    }
  })

  return app;
}