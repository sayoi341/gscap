import { createWorker } from "tesseract.js";

export async function recognizer(
  image: string,
  whiteList: string,
  lang: string,
): Promise<string> {
  const worker = await createWorker(lang);

  await worker.setParameters({
    tessedit_char_whitelist: whiteList,
  });

  const {
    data: { text },
  } = await worker.recognize(image);
  await worker.terminate();

  // text内の空白を削除
  return text.replace(/\s/g, "");
}
