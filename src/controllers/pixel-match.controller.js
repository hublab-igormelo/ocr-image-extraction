import fs from 'fs';
import Jimp from "jimp";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import path from 'path';
import { fileURLToPath } from 'url';

const urlToBuffer = async (url) => {
  return new Promise(async (resolve, reject) => {
    await Jimp.read(url, async (err, image) => {
      if (err) reject(err);
      image.resize(400, 400);
      return image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) reject(err);
        resolve(buffer);
      });
    });
  })
}

const compareImage = async (img) => {
  try {
    if (!img) throw new Error("Image is required");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const base64ToBuffer = (base64String) => {
      const data = base64String.replace(/^data:image\/\w+;base64,/, '');
      return Buffer.from(data, 'base64');
    };

    const imgUser = await urlToBuffer(base64ToBuffer(img));

    // Lista para armazenar as imagens lidas
    const imagesNotApprovedToCompare = [], imagesApprovedToCompare = [];

    // Caminhos dos arquivos das imagens não aprovadas
    const imageNotApprovedPaths = [
      __dirname + '/not_approved/exem_1.png',
      __dirname + '/not_approved/exem_2.png',
      __dirname + '/not_approved/exem_3.png',
      __dirname + '/not_approved/exem_4.png',
      __dirname + '/not_approved/exem_5.png',
      __dirname + '/not_approved/exem_6.png',
      __dirname + '/not_approved/exem_7.png',
      __dirname + '/not_approved/exem_8.png',
      __dirname + '/not_approved/exem_9.png',
      __dirname + '/not_approved/exem_10.png'
    ];

    // Caminhos dos arquivos das imagens aprovadas
    const imageApprovedPaths = [
      __dirname + '/approved/exem_1.png',
      __dirname + '/approved/exem_2.png',
      __dirname + '/approved/exem_3.png',
      __dirname + '/approved/exem_4.png',
      __dirname + '/approved/exem_5.png',
      __dirname + '/approved/exem_6.png',
      __dirname + '/approved/exem_7.png',
      __dirname + '/approved/exem_8.png',
      __dirname + '/approved/exem_9.png',
      __dirname + '/approved/exem_10.png',
      __dirname + '/approved/exem_11.png',
      __dirname + '/approved/exem_12.png',
      __dirname + '/approved/exem_13.png',
      __dirname + '/approved/exem_14.png',
      __dirname + '/approved/exem_15.png',
      __dirname + '/approved/exem_16.png',
      __dirname + '/approved/exem_17.png',
      __dirname + '/approved/exem_18.png',
      __dirname + '/approved/exem_19.png',
      __dirname + '/approved/exem_20.png',
      __dirname + '/approved/exem_21.png',
      __dirname + '/approved/exem_22.png',
      __dirname + '/approved/exem_23.png',
      __dirname + '/approved/exem_24.png',
      __dirname + '/approved/exem_25.png',
      __dirname + '/approved/exem_26.png',
      __dirname + '/approved/exem_27.png',
      __dirname + '/approved/exem_28.png',
      __dirname + '/approved/exem_29.png',
      __dirname + '/approved/exem_30.png',
      __dirname + '/approved/exem_31.png',
      __dirname + '/approved/exem_32.png',
      __dirname + '/approved/exem_33.png',
      __dirname + '/approved/exem_34.png',
      __dirname + '/approved/exem_35.png',
      __dirname + '/approved/exem_36.png',
      __dirname + '/approved/exem_37.png',
      __dirname + '/approved/exem_38.png',
      __dirname + '/approved/exem_39.png',
      __dirname + '/approved/exem_40.png',
      __dirname + '/approved/exem_41.png',
      __dirname + '/approved/exem_42.png',
      __dirname + '/approved/exem_43.png'
    ];

    // Loop para ler as imagens e armazená-las na lista
    for (const imagePath of imageNotApprovedPaths) {
      const imgBuffer = await urlToBuffer(fs.readFileSync(imagePath));
      imagesNotApprovedToCompare.push(imgBuffer);
    }

    // Loop para ler as imagens e armazená-las na lista
    for (const imagePath of imageApprovedPaths) {
      const imgBuffer = await urlToBuffer(fs.readFileSync(imagePath));
      imagesApprovedToCompare.push(imgBuffer);
    }

    var listOfComparedImages = { notApproved: [], approved: [] };

    for (const image of imagesNotApprovedToCompare) {
      const imgCompare = PNG.sync.read(image);
      const imgUserRead = PNG.sync.read(imgUser);
      const { width, height } = imgCompare;
      const diff = new PNG({ width, height });
      const difference = pixelmatch(imgCompare.data, imgUserRead.data, diff.data, width, height, { threshold: 0.1 });
      const compatibility = 100 - (difference * 100) / (width * height);
      listOfComparedImages.notApproved.push(compatibility);
    }

    for (const image of imagesApprovedToCompare) {
      const imgCompare = PNG.sync.read(image);
      const imgUserRead = PNG.sync.read(imgUser);
      const { width, height } = imgCompare;
      const diff = new PNG({ width, height });
      const difference = pixelmatch(imgCompare.data, imgUserRead.data, diff.data, width, height, { threshold: 0.1 });
      const compatibility = 100 - (difference * 100) / (width * height);
      listOfComparedImages.approved.push(compatibility);
    }

    return listOfComparedImages;
  } catch (error) {
    throw error;
  }
}

export default compareImage;