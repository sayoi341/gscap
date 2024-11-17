import { Image } from "image-js";

function imageToCropedGreyBase64(
  image: Image,
  x: number,
  y: number,
  width: number,
  height: number,
  inverse: boolean,
  useMask: boolean,
): string {
  const croped = image.crop({ x: x, y: y, width: width, height: height });
  let grey = croped.grey();
  if (useMask) {
    grey = grey.mask({
      threshold: 190,
      invert: false,
    });
  }
  if (inverse) {
    grey = grey.invert();
  }
  return grey.toDataURL();
}

export async function imagePreprocessor(image: Buffer): Promise<{
  setImage: string;
  pieceImage: string;
  mainStatusKeyImage: string;
  mainStatusValueImage: string;
  subStatuesImages: string[];
}> {
  const img = await Image.load(image);
  const { width, height } = img; // 画像の必要部分への分割
  const { widthRate, heightRate } = {
    widthRate: width / 1920,
    heightRate: height / 1080,
  };

  // set (1308, 632) (492, 32)
  const setImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    632 * heightRate,
    492 * widthRate,
    32 * heightRate,
    false,
    true,
  );

  // piece (1308, 187) (150, 30)
  const pieceImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    187 * heightRate,
    150 * widthRate,
    30 * heightRate,
    true,
    false,
  );

  // mainStatusKey (1308, 269) (250, 30)
  const mainStatusKeyImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    269 * heightRate,
    250 * widthRate,
    30 * heightRate,
    true,
    false,
  );

  // mainStatusValue (1308, 299) (250, 50)
  const mainStatusValueImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    299 * heightRate,
    250 * widthRate,
    50 * heightRate,
    true,
    false,
  );

  // subStatus (1308, 476) (492, 37)
  // subStatus (1308, 514) (492, 37)
  // subStatus (1308, 552) (492, 37)
  // subStatus (1308, 590) (492, 37)
  const subStatusOneImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    476 * heightRate,
    492 * widthRate,
    37 * heightRate,
    false,
    false,
  );
  const subStatusTwoImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    514 * heightRate,
    492 * widthRate,
    37 * heightRate,
    false,
    false,
  );
  const subStatusThreeImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    552 * heightRate,
    492 * widthRate,
    37 * heightRate,
    false,
    false,
  );
  const subStatusFourImg = imageToCropedGreyBase64(
    img,
    1308 * widthRate,
    590 * heightRate,
    492 * widthRate,
    37 * heightRate,
    false,
    false,
  );

  return {
    setImage: setImg,
    pieceImage: pieceImg,
    mainStatusKeyImage: mainStatusKeyImg,
    mainStatusValueImage: mainStatusValueImg,
    subStatuesImages: [
      subStatusOneImg,
      subStatusTwoImg,
      subStatusThreeImg,
      subStatusFourImg,
    ],
  };
}
