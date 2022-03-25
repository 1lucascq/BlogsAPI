require('dotenv').config();
const express = require('express');
const routes = require('./api/routes/routes');

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (request, response) => {
  response.send();
});

app.use('/', routes);

app.listen(PORT, () => console.log(`On: ${PORT}`));