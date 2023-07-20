const express = require('express');
const axios = require('axios');
require('dotenv').config()
const app = express();
const port = 8080;

const discordWebhookURL = process.env.WEBHOOK_URL;

app.use(express.json());

app.post('/github-webhook', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'push') {
    const commit = payload.head_commit;
    const message = commit.message;
    const author = commit.author.name;
    const repository = payload.repository.full_name;

    const content = `Nova atualização\n> Por: **${author}**\n\n> Atualização:\n**${message}**`;

    axios.post(discordWebhookURL, { content })
      .then(() => console.log('Mensagem enviada com sucesso para o Discord!'))
      .catch(error => console.error('Erro ao enviar a mensagem:', error.message));
  }

  res.status(200).end();
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});