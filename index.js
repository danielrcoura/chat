const express = require('express');
const app = express();
const tokenGenerator = require('./tokenGenerator');

app.use(express.json());

app.use(express.static('public'))

app.post('/token', (req, res) => {
  const deviceId = req.body.deviceId
  const identity = req.body.identity;

  const token = tokenGenerator.generate(identity, deviceId)

  res.send({
    identity: identity,
    token: token.toJwt(),
  });
});

const port = process.env.PORT || 3000;
app.listen(port);
