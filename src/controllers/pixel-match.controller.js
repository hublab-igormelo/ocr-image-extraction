import fs from 'fs';
import Jimp from "jimp";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import path from 'path';
import { fileURLToPath } from 'url';
import stringSimilarity from 'string-similarity';

import extractTextFromImage from './ocr-extract.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fileBlockedPath = __dirname + '/not_approved/not_approved_blocked.txt';

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

    const base64ToBuffer = (base64String) => {
      const data = base64String.replace(/^data:image\/\w+;base64,/, '');
      return Buffer.from(data, 'base64');
    };

    const imgUser = await urlToBuffer(base64ToBuffer(img));

    // Lista para armazenar as imagens lidas
    const imagesNotApprovedToCompare = [], imagesApprovedToCompare = [];

    // Caminhos dos arquivos das imagens não aprovadas
    var imageNotApprovedPaths = [];
    for (let i = 1; i <= 10; i++) {
      const imagePath = path.join(__dirname, 'not_approved', `exem_${i}.png`);
      imageNotApprovedPaths.push(imagePath);
    }

    // Caminhos dos arquivos das imagens aprovadas
    var imageApprovedPaths = [];
    for (let i = 1; i <= 44; i++) {
      const imagePath = path.join(__dirname, 'approved', `exem_${i}.png`);
      imageApprovedPaths.push(imagePath);
    }

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

    var userPhrase = await extractTextFromImage(imgUser);
    userPhrase = userPhrase[0];

    const phrases = readPhrasesFromFile();
    const totalSimilarity = [];

    const ocrListSimilaritys = stringSimilarity.findBestMatch(userPhrase, [...phrases]);
    ocrListSimilaritys.ratings.forEach((rating, index) => {
      totalSimilarity.push(rating.rating);
    });

    listOfComparedImages.blockedOcrMatch = ocrListSimilaritys.bestMatch;

    return listOfComparedImages;
  } catch (error) {
    throw error;
  }
}

const readPhrasesFromFile = () => {
  try {
    const data = fs.readFileSync(fileBlockedPath, 'utf-8');
    const phrases = data.split('\n').map((phrase) => phrase.trim());
    return phrases;
  } catch (error) {
    throw error;
  }
};

export default compareImage;