import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 3000;

import ocrExtractRoute from './routes/ocr-extract.route.js';

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/ocr', ocrExtractRoute);

app.listen(port, () => {
  console.log(`OCR API listening at http://localhost:${port}`);
});