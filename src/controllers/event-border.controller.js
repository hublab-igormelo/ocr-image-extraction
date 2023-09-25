import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function placeBorderEventInImage(imageUserBase64, imageFrameBase64) {
  if (!imageUserBase64) throw new Error("'img' base64 is required in body");
  try {
    // REGRA APENAS PARA ID HUBCHAT
    imageUserBase64 = await getImageByIdHubchat(imageUserBase64);

    const userImageBuffer = Buffer.from(imageUserBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    var borderImageBuffer;

    try {
      const response = await axios.get(imageFrameBase64, { responseType: 'arraybuffer' });
      borderImageBuffer = Buffer.from(response.data, 'utf-8');
    } catch (error) {
      borderImageBuffer = imageFrameBase64 ? Buffer.from(imageFrameBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64') : __dirname + '/event-border/moldura-default-blue.png';
    }

    const userImage = sharp(userImageBuffer);
    const borderImage = sharp(borderImageBuffer);

    userImage.resize(3000, 3000);
    borderImage.resize(3000, 3000);

    const currentDate = moment().format('YYYY-MM-DD-HHmmss');
    const outputFileName = `mergedImage${uuidv4()}_${currentDate}.png`;
    const urlToImage = 'https://' + process.env.HEROKU_PROJECT_NAME + '.herokuapp.com/static/' + outputFileName;

    const mergedImageBuffer = await userImage.composite([
      {
        input: await borderImage.toBuffer(),
        left: 0,
        top: 0,
        blend: 'over',
      },
    ]).toBuffer();

    const pathToEventBorder = path.join(__dirname, 'event-border');
    if (!fs.existsSync(pathToEventBorder)) {
      fs.mkdirSync(pathToEventBorder);
    }

    const pathToProcessedFrame = path.join(__dirname, 'event-border', 'processed');
    if (!fs.existsSync(pathToProcessedFrame)) {
      fs.mkdirSync(pathToProcessedFrame);
    }

    const outputPath = path.join(__dirname, 'event-border', 'processed', outputFileName);
    fs.writeFileSync(outputPath, mergedImageBuffer);

    return urlToImage;
  } catch (error) {
    console.trace(error);
    throw new Error("Error processing image" + error.message);
  }
}

async function getImageByIdHubchat(imgId) {
  let config = {
    method: 'get',
    url: `https://whats.hublab.com.br/meta/media/f3CmtIezelgki701/${imgId}`,
  };
  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    return error.message;
  }
}

export default placeBorderEventInImage;