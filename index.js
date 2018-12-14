const express = require('express');
const app = express();
const tokenGenerator = require('./tokenGenerator');
const nameGenerator = require('./nameGenerator');

app.use(express.json());

app.use(express.static('public'))

app.post('/token', (req, res) => {
  const identity = nameGenerator();
  const token = tokenGenerator.generate(identity);

  res.send({
    identity: identity,
    token: token.toJwt(),
  });
});

const port = process.env.PORT || 3000;
app.listen(port);
