import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

import ocrExtractRoute from './routes/ocr-extract.route.js';
import pixelMatchRoute from './routes/pixel-match.route.js';
import frameByImageRoute from './routes/event-border.route.js';

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.text({ limit: '200mb' }));

app.use('/static', express.static(path.join(__dirname, 'controllers', 'event-border', 'processed')));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/ocr', ocrExtractRoute);
app.use('/match', pixelMatchRoute);
app.use('/frame', frameByImageRoute);

app.listen(port, () => {
  console.log(`OCR API listening at http://localhost:${port}`);
});