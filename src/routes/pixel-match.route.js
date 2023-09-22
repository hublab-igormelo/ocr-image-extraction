import express from 'express';
import logRoute from '../utils/log-route-message.js';
import compareImage from '../controllers/pixel-match.controller.js';
const router = express.Router();

router.use(function timeLog(req, res, next) {
  console.log(JSON.stringify(logRoute(req)));
  next();
});

router.get('/compare', async (req, res) => {
  try {
    const compareResult = await compareImage(req.body.img);
    res.status(200).json({ code: "00", result: compareResult });
  } catch (error) {
    console.error(error)
    res.status(400).json({ code: "99", message: error.message })
  }
});

export default router;