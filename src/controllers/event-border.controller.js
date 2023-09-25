import sharp from 'sharp';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function placeBorderEventInImage(imageUserBase64, imageFrameBase64) {
  if (!imageUserBase64) throw new Error("'img' base64 is required in body");
  try {
    const userImageBuffer = Buffer.from(imageUserBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const borderImageBuffer = imageFrameBase64 ? Buffer.from(imageFrameBase64.replace(/^data:image\/\w+;base64,/, ''), 'base64') : __dirname + '/event-border/moldura-default-blue.png';
    
    const userImage = sharp(userImageBuffer);
    const borderImage = sharp(borderImageBuffer);

    userImage.resize(1000, 1000);
    borderImage.resize(1000, 1000);

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    const outputFileName = `mergedImage_${currentDate}.png`;

    const mergedImageBuffer = await userImage.composite([
      {
        input: await borderImage.toBuffer(),
        left: 0,
        top: 0,
        blend: 'over',
      },
    ]).toBuffer();

    // const outputPath = path.join(__dirname, 'event-border', 'processed', outputFileName);
    // fs.writeFileSync(outputPath, mergedImageBuffer);

    return mergedImageBuffer;
  } catch (error) {
    console.trace(error);
    throw new Error("Error processing image" + error.message);
  }
}

export default placeBorderEventInImage;