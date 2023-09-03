import express from 'express';
import logRoute from '../utils/log-route-message.js';
import extractTextFromImage from '../controllers/ocr-extract.controller.js';
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(JSON.stringify(logRoute(req)));
  next();
});

router.get('/extract', async (req, res) => {
  try {
    const resultExtraction = await extractTextFromImage(req.body.img);
    res.status(200).json({ code: "00", result: resultExtraction });
  } catch (error) {
    res.status(400).json({ code: "99", message: error.message })
  }
});

export default router;