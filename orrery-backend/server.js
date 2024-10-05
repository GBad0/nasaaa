const express = require('express');
const cors = require('cors'); // Importar o cors

const app = express();
const port = 5000;

app.use(cors()); // Usar o cors no back-end

app.get('/', (req, res) => {
  res.send('Hello, NASA Hackathon!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
