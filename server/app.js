/* eslint-disable no-undef */
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

const notionApiKey = process.env.NOTION_API_KEY;

app.post('/databases', bodyParser.json(), async (req, res) => {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.notion.com/v1/databases/334aa5a9-fd2f-4f26-8f8f-610a07fb772b/query',
      headers: {
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
        Authorization: `Bearer ${notionApiKey}`
      },
      data: req.body
    });

    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(3002, () => {
  console.log('Server is listening on port 3002');
});
