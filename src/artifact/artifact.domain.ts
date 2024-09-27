import { createHash } from "node:crypto";

type ArtifactSet =
  | "initiate"
  | "adventurer"
  | "luckyDog"
  | "travelingDoctor"
  | "resolutionOfSojourner"
  | "tinyMiracle"
  | "berserker"
  | "instructor"
  | "theExile"
  | "defendersWill"
  | "braveHeart"
  | "martialArtist"
  | "gambler"
  | "scholar"
  | "prayersForWisdom"
  | "prayersForDestiny"
  | "prayersForIllumination"
  | "prayersForSpringtime"
  | "gladiatorsFinale" // 剣闘士のフィナーレ
  | "wandersTroupe" // 大地を流浪する楽団
  | "noblesseOblige" // 旧貴族のしつけ
  | "bloodstainedChivalry" // 血染めの騎士道
  | "maidenBeloved" // 愛される少女
  | "viridescentVenerer" // 翠緑の影
  | "archaicPetra" // 悠久の盤岩
  | "retracingBolide" // 逆飛びの流星
  | "thunderSoother" // 雷を鎮める尊者
  | "lavawalker" // 烈火を渡る賢者
  | "crimsonWitchOfFlames" // 燃え盛る炎の魔女
  | "blizzardStrayer" // 氷風を彷徨う勇士
  | "heartOfDepth" // 沈淪の心
  | "tenacityOfTheMillelith" // 千岩牢固
  | "paleFlame" // 蒼白の炎
  | "shimenawasReminiscence" // 追憶のしめ縄
  | "emblemOfSeveredFate" // 絶縁の旗印
  | "huskOfOpulentDreams" // 華館夢醒形骸記
  | "oceanHuedClam" // 海染硨磲
  | "vermillionHereafter" // 辰砂往生録
  | "echoesOfAnOffering" // 来歆の余響
  | "deepWoodMemories" // 深林の記憶
  | "gildedDreams" // 金メッキの夢
  | "desertPavilion" // 砂上の楼閣の史話
  | "flowerOfParadiseLost" // 楽園の絶花
  | "nymphsDream" // 水仙の夢
  | "vourukashasGlow" // 花海甘露の光
  | "MarechausseeHunter" // ファントムハンター
  | "goldenTroupe" // 黄金の劇団
  | "songOfDaysPast" // 在りし日の歌
  | "nighttimeWhisperInTheEchoingWoods" // 残響の森で囁かれる夜話
  | "fragmentOfHarmonicWhimsy" // 諧律奇想の断章
  | "unfinishedReverie" // 遂げられなかった想い
  | "scrollOfTheHeroOfCinderCity" // 灰燼の都に立つ英雄の絵巻
  | "obsidianCodex"; // 黒曜の秘典

type ArtifactPosition = "flower" | "plume" | "sands" | "goblet" | "circlet";

const artifactMainStatusMap = {
  flower: ["hp"],
  plume: ["atk"],
  sands: [
    "atkPersent",
    "defPersent",
    "hpPersent",
    "elementalMastery", // 元素熟知
    "energyRecharge", // 元素チャージ効率
  ],
  goblet: [
    "atkPersent",
    "defPersent",
    "hpPersent",
    "elementalMastery", // 元素熟知
    "physicalDmgBonus", // 物理ダメージ
    "pyroDmgBonus", // 炎ダメージバフ
    "hydroDmgBonus", // 水ダメージバフ
    "dendroDmgBonus", // 草ダメージバフ
    "electroDmgBonus", // 雷ダメージバフ
    "anemoDmgBonus", // 風ダメージバフ
    "cryoDmgBonus", // 氷ダメージバフ
    "geoDmgBonus", //岩ダメージバフ
  ],
  circlet: [
    "atkPersent",
    "defPersent",
    "hpPersent",
    "elementalMastery", // 元素熟知
    "critRate", // 会心率
    "critDmg", //会心ダメージ
  ],
} as const;

type ArtifactMainStatus<T extends ArtifactPosition> =
  (typeof artifactMainStatusMap)[T][number];

type ArtifactSubStatus = {
  hp?: number;
  atk?: number;
  def?: number;
  hpPersent?: number;
  atkPersent?: number;
  defPersent?: number;
  elementalMastery?: number;
  energyRecharge?: number;
  critRate?: number;
  critDmg?: number;
};

export class Artifact {
  public hash: string;
  public stars: number;
  public set: ArtifactSet;
  public position: ArtifactPosition;
  public mainStatus: ArtifactMainStatus<ArtifactPosition>;
  public subStatus: ArtifactSubStatus;

  constructor(
    stars: number,
    set: ArtifactSet,
    position: ArtifactPosition,
    mainStatus: ArtifactMainStatus<ArtifactPosition>,
    subStatus: ArtifactSubStatus,
  ) {
    this.stars = stars;
    this.set = set;
    this.position = position;

    // mainStatusがpositionで変化した型に対応しているかチェック
    if (
      !(artifactMainStatusMap[position] as ReadonlyArray<string>).includes(
        mainStatus,
      )
    ) {
      throw new artifactDomainError("invalid artifact main status");
    }

    this.mainStatus = mainStatus;

    // subStatusが4つ以下かチェック
    const subStatusKeys = Object.keys(subStatus) as string[];
    if (subStatusKeys.length > 4) {
      throw new artifactDomainError(
        "artifact sub status should be less than 4",
      );
    }

    // subStatusがmainStatusと異なるかチェック
    if (subStatusKeys.includes(mainStatus as string)) {
      throw new artifactDomainError(
        "artifact sub status should not same main status",
      );
    }

    this.subStatus = subStatus;

    this.hash = this.createHash();
  }

  createHash() {
    return createHash("sha256")
      .update(this.set)
      .update(this.position)
      .update(this.mainStatus)
      .update(JSON.stringify(this.subStatus))
      .digest("hex");
  }
}

class artifactDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ArtifactDomainError";
  }
}
