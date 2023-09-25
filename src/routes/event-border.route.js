import express from 'express';
import logRoute from '../utils/log-route-message.js';
import placeBorderEventInImage from '../controllers/event-border.controller.js';
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(JSON.stringify(logRoute(req)));
  next();
});

router.get('/createFrameByImage', async (req, res) => {
  try {
    const resultExtraction = await placeBorderEventInImage(req.body.img, req.body.imgFrame);
    res.status(200).type('image/png').send(resultExtraction);
  } catch (error) {
    res.status(400).json({ code: "99", message: error.message })
  }
});

router.get('/imageProcessed', async (req, res) => {
  try {
    const resultExtraction = await placeBorderEventInImage(req.body.img);
    res.status(200).type('image/png').send(resultExtraction);
  } catch (error) {
    res.status(400).json({ code: "99", message: error.message })
  }
});

export default router;