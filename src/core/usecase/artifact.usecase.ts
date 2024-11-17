import type { Artifact } from "@/core/entity/artifact.entity";
import type { IArtifactRepository } from "@/core/infra/repository/artifact.repository.interface";
import type { ArtifactUseCaseDTO } from "@/core/usecase/artifact.usecase.dto";

import { mainStatusTranslateData } from "@/i18n/artifact/mainStatus";
import { pieceTranslateData } from "@/i18n/artifact/piece";
import { setTranslateData } from "@/i18n/artifact/set";
import { subStatusesTranslateData } from "@/i18n/artifact/subStatuses";

export class ArtifactUseCase {
  constructor(private readonly repository: IArtifactRepository) {}

  // 聖遺物情報の取得
  async recognizeArtifact(
    artifactUseCaseDTO: ArtifactUseCaseDTO,
    recognizer: (
      image: string,
      whiteList: string,
      lang: string,
    ) => Promise<string>,
    imagePreprosessor: (image: Buffer) => Promise<{
      setImage: string;
      pieceImage: string;
      mainStatusKeyImage: string;
      mainStatusValueImage: string;
      subStatuesImages: string[];
    }>,
    lang: string,
  ): Promise<Artifact> {
    const setDoc = setTranslateData[lang];
    const pieceDoc = pieceTranslateData[lang];
    const mainStatusDoc = mainStatusTranslateData[lang];
    const subStatusesDoc = subStatusesTranslateData[lang];

    // window image to artifact images
    const {
      setImage,
      pieceImage,
      mainStatusKeyImage,
      mainStatusValueImage,
      subStatuesImages,
    } = await imagePreprosessor(artifactUseCaseDTO.artifactImage);

    // create white list
    const whiteList = this.createWhiteListSet(setDoc, pieceDoc, mainStatusDoc);

    // image to text
    const setKey = await recognizer(setImage, whiteList, lang);
    const pieceKey = await recognizer(pieceImage, whiteList, lang);
    const mainStatusKey = await recognizer(mainStatusKeyImage, whiteList, lang);
    const mainStatusValue = await recognizer(
      mainStatusValueImage,
      whiteList,
      lang,
    );
    const subStatuesTexts = await Promise.all(
      subStatuesImages.map(async (image) => recognizer(image, whiteList, lang)),
    );

    const mainStatusPercent = mainStatusValue.slice(-1) === "%";
    const subStatuesKeyValuePercent = subStatuesTexts.map((subStatus) =>
      this.validateSubStatus(subStatus),
    );

    // keyとvalueを逆転させる
    const setVK = this.DocToVK(setDoc);
    const pieceVK = this.DocToVK(pieceDoc);
    const mainStatusVK = this.DocToVK(mainStatusDoc);
    const subStatusVK = this.DocToVK(subStatusesDoc);

    // translate text
    const set = setVK[setKey];
    const piece = pieceVK[pieceKey];
    const mainStatusTranslatedKey = mainStatusVK[mainStatusKey];
    const isAtkDefHP =
      mainStatusTranslatedKey === "atk" ||
      mainStatusTranslatedKey === "def" ||
      mainStatusTranslatedKey === "hp";
    const mainStatus = `${mainStatusTranslatedKey}${mainStatusPercent && isAtkDefHP ? "Percent" : ""}`;
    const subStatuses = Object.assign(
      {},
      ...subStatuesKeyValuePercent.map(
        ({ subStatusKey, subStatusValue, isPercents }) => {
          const translatedKey = subStatusVK[subStatusKey];
          const isAtkDefHP =
            translatedKey === "atk" ||
            translatedKey === "def" ||
            translatedKey === "hp";

          return {
            [`${subStatusVK[subStatusKey]}${
              isPercents && isAtkDefHP ? "Percent" : ""
            }`]: subStatusValue,
          };
        },
      ),
    );

    // create artifact
    const artifact = this.repository.create(
      5,
      set,
      piece,
      mainStatus,
      subStatuses,
    );

    return artifact;
  }

  // 聖遺物情報の送信
  sendArtifact() {}

  private createWhiteListSet(
    setDoc: { [key: string]: string },
    pieceDoc: { [key: string]: string },
    mainStatusDoc: { [key: string]: string },
  ) {
    const setStrings = Object.values(setDoc).join("");
    const pieceStrings = Object.values(pieceDoc).join("");
    const mainStatusStrings = Object.values(mainStatusDoc).join("");

    const whiteListSet = new Set([
      ...setStrings,
      ...pieceStrings,
      ...mainStatusStrings,
    ]);

    const whiteListString = Array.from(whiteListSet)
      .join("")
      .concat("0123456789+.%");

    return whiteListString;
  }

  private validateSubStatus(subStatus: string) {
    // "+"を境に分割
    const subStatuKey = subStatus.split("+")[0];
    const subStatusValue = subStatus.split("+")[1];

    if (subStatusValue.slice(-1) === "%") {
      return {
        subStatusKey: subStatuKey,
        subStatusValue: Number(subStatusValue.slice(0, -1)),
        isPercents: true,
      };
    }
    return {
      subStatusKey: subStatuKey,
      subStatusValue: Number(subStatusValue),
      isPercents: false,
    };
  }

  private DocToVK(doc: { [key: string]: string }) {
    return Object.assign(
      {},
      ...Object.entries(doc).map(([key, value]) => ({
        [value]: key,
      })),
    );
  }
}
