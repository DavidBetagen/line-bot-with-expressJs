'use strict';

require('dotenv').config();

// Imports dependencies and set up http server
const express    = require('express');
const bodyParser = require('body-parser');
const app        = express().use(bodyParser.json()); // creates express http server
const request    = require('request');

const LINE_MESSAGING_API = 'https://api.line.me/v2/bot/message';
const LINE_HEADER = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.token}`
};

// Sets server port and logs message on success
app.listen(process.env.PORT, () => console.log(`Webhook is listening on port ${process.env.PORT}`));

app.post('/webhook', (req, res) => {
    let body       = req.body;
    let replyToken = body.events[0].replyToken;
    let message    = body.events[0].message.text;

    reply(replyToken, message);

    res.status(200).send('EVENT_RECEIVED');
});

const reply = (replyToken, message) => {
    let body = {
        "replyToken": replyToken,
        "messages": [
            {
              type: "text",
              text: `You sent the message: "${message}" to me!`
            }
          ]
    }

    request({
      "method": "POST",
      "uri": `${LINE_MESSAGING_API}/reply`,
      "headers": LINE_HEADER,
      "json": body
    }, (err, res, body) => {
        if (!err) {
          console.log('message sent!')
        } else {
          console.error("Unable to send message:" + err);
        }
    });
  };