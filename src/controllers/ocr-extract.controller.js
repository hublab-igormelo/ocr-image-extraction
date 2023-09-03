import { createWorker, createScheduler } from 'tesseract.js';

async function extractTextFromImage(img) {
  if (!img) throw new Error("Image is required");
  const scheduler = createScheduler();
  const worker1 = await createWorker();
  const worker2 = await createWorker();

  const results = await (async () => {
    await worker1.loadLanguage('por');
    await worker2.loadLanguage('por');
    await worker1.initialize('por');
    await worker2.initialize('por');
    scheduler.addWorker(worker1);
    scheduler.addWorker(worker2);
    /** Add 10 recognition jobs */
    const results = await Promise.all(Array(10).fill(0).map(() => (
      scheduler.addJob('recognize', img)
    )))
    await scheduler.terminate(); // It also terminates all workers.
    return results.map(({ data: { text } }) => text);
  })();

  return results;
}

export default extractTextFromImage;