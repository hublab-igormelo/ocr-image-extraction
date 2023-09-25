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
    const imageWithFrame = await placeBorderEventInImage(req.body.img, req.body.imgFrame);
    console.log('https://' + process.env.HEROKU_PROJECT_NAME + '.herokuapp.com/static/' + imageWithFrame)
    res.status(200).json({ code: "00", message: "Image processed successfully", linkImage: imageWithFrame });
  } catch (error) {
    res.status(400).json({ code: "99", message: error.message })
  }
});

export default router;