import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

import ocrExtractRoute from './routes/ocr-extract.route.js';

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/ocr', ocrExtractRoute);

app.listen(port, () => {
  console.log(`OCR API listening at http://localhost:${port}`);
});