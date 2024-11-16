import exp = require("node:constants");
import { createHash } from "node:crypto";

const artifactSet = [
  "initiate",
  "adventurer",
  "luckyDog",
  "travelingDoctor",
  "resolutionOfSojourner",
  "tinyMiracle",
  "berserker",
  "instructor",
  "theExile",
  "defendersWill",
  "braveHeart",
  "martialArtist",
  "gambler",
  "scholar",
  "prayersForWisdom",
  "prayersForDestiny",
  "prayersForIllumination",
  "prayersForSpringtime",
  "gladiatorsFinale", // 剣闘士のフィナーレ
  "wandersTroupe", // 大地を流浪する楽団
  "noblesseOblige", // 旧貴族のしつけ
  "bloodstainedChivalry", // 血染めの騎士道
  "maidenBeloved", // 愛される少女
  "viridescentVenerer", // 翠緑の影
  "archaicPetra", // 悠久の盤岩
  "retracingBolide", // 逆飛びの流星
  "thunderSoother", // 雷を鎮める尊者
  "thunderingFury", // 雷のような怒り"
  "lavawalker", // 烈火を渡る賢者
  "crimsonWitchOfFlames", // 燃え盛る炎の魔女
  "blizzardStrayer", // 氷風を彷徨う勇士
  "heartOfDepth", // 沈淪の心
  "tenacityOfTheMillelith", // 千岩牢固
  "paleFlame", // 蒼白の炎
  "shimenawasReminiscence", // 追憶のしめ縄
  "emblemOfSeveredFate", // 絶縁の旗印
  "huskOfOpulentDreams", // 華館夢醒形骸記
  "oceanHuedClam", // 海染硨磲
  "vermillionHereafter", // 辰砂往生録
  "echoesOfAnOffering", // 来歆の余響
  "deepWoodMemories", // 深林の記憶
  "gildedDreams", // 金メッキの夢
  "desertPavilionChronicle", // 砂上の楼閣の史話
  "flowerOfParadiseLost", // 楽園の絶花
  "nymphsDream", // 水仙の夢
  "vourukashasGlow", // 花海甘露の光
  "MarechausseeHunter", // ファントムハンター
  "goldenTroupe", // 黄金の劇団
  "songOfDaysPast", // 在りし日の歌
  "nighttimeWhispersInTheEchoingWoods", // 残響の森で囁かれる夜話
  "fragmentOfHarmonicWhimsy", // 諧律奇想の断章
  "unfinishedReverie", // 遂げられなかった想い
  "scrollOfTheHeroOfCinderCity", // 灰燼の都に立つ英雄の絵巻
  "obsidianCodex", // 黒曜の秘典
] as const;

export type ArtifactSet = (typeof artifactSet)[number];

const artifactPiece = [
  "flowerOfLife",
  "plumeOfDeath",
  "sandsOfEon",
  "gobletOfEonothem",
  "circletOfLogos",
] as const;

export type ArtifactPiece = (typeof artifactPiece)[number];

const artifactMainStatus = {
  flowerOfLife: ["hp"],
  plumeOfDeath: ["atk"],
  sandsOfEon: [
    "atkPercent",
    "defPercent",
    "hpPercent",
    "elementalMastery", // 元素熟知
    "energyRecharge", // 元素チャージ効率
  ],
  gobletOfEonothem: [
    "atkPercent",
    "defPercent",
    "hpPercent",
    "elementalMastery", // 元素熟知
    "physicalDmgBonus", // 物理ダメージ
    "pyroDmgBonus", // 炎ダメージバフ
    "hydroDmgBonus", // 水ダメージバフ
    "dendroDmgBonus", // 草ダメージバフ
    "electroDmgBonus", // 雷ダメージバフ
    "anemoDmgBonus", // 風ダメージバフ
    "cryoDmgBonus", // 氷ダメージバフ
    "geoDmgBonus", // 岩ダメージバフ
  ],
  circletOfLogos: [
    "atkPercent",
    "defPercent",
    "hpPercent",
    "elementalMastery", // 元素熟知
    "critRate", // 会心率
    "critDmg", // 会心ダメージ
    "healingBonus", // 治癒バフ
  ],
} as const;

export type ArtifactMainStatus<T extends ArtifactPiece> =
  (typeof artifactMainStatus)[T][number];

const ArtifactSubStatuses = [
  "hp",
  "atk",
  "def",
  "hpPercent",
  "atkPercent",
  "defPercent",
  "elementalMastery",
  "energyRecharge",
  "critRate",
  "critDmg",
] as const;

export type ArtifactSubStatuses = {
  [key in (typeof ArtifactSubStatuses)[number]]: number;
};

export class Artifact {
  public readonly hash: string;
  public readonly stars: number;
  public readonly set: ArtifactSet;
  public readonly piece: ArtifactPiece;
  public readonly mainStatus: ArtifactMainStatus<ArtifactPiece>;
  public readonly subStatuses: ArtifactSubStatuses;

  constructor(
    stars: number,
    set: string,
    piece: string,
    mainStatus: string,
    subStatuses: { [key: string]: number },
  ) {
    // starsが1~5かチェック
    if (stars < 1 || 5 < stars) {
      throw new ArtifactDomainError("invalid artifact stars");
    }
    this.stars = stars;

    // setがArtifactSet型に含まれるかチェック
    if (!this.isArtifactSet(set)) {
      throw new ArtifactDomainError("invalid artifact set");
    }
    this.set = set;

    // PieceがArtifactPiece型に含まれるかチェック
    if (!this.isArtifactPiece(piece)) {
      throw new ArtifactDomainError("invalid artifact piece");
    }
    this.piece = piece as ArtifactPiece;

    // mainStatusがPieceで変化した型に当てはまるかチェック
    if (!this.isArtifactMainStatus(this.piece, mainStatus)) {
      throw new ArtifactDomainError("invalid artifact main status");
    }
    this.mainStatus = mainStatus as ArtifactMainStatus<ArtifactPiece>;

    // subStatusesが4つ以下かチェック
    if (Object.keys(subStatuses).length > 4) {
      throw new ArtifactDomainError(
        "artifact sub statuses should be less than 4",
      );
    }

    // subStatusesがmainStatusと異なるかチェック
    if (Object.keys(subStatuses).includes(mainStatus)) {
      throw new ArtifactDomainError(
        "artifact sub statuses should not same main status",
      );
    }

    // subStatusesがArtifactSubStatuses型に含まれるかチェック
    if (!this.isArtifactSubStatuses(subStatuses)) {
      throw new ArtifactDomainError("invalid artifact sub statuses");
    }
    this.subStatuses = subStatuses as ArtifactSubStatuses;

    this.hash = this.createHash();
  }

  private isArtifactSet(set: string): set is ArtifactSet {
    return artifactSet.some((s) => s === set);
  }

  private isArtifactPiece(piece: string): piece is ArtifactPiece {
    return artifactPiece.some((p) => p === piece);
  }

  private isArtifactMainStatus(
    piece: ArtifactPiece,
    mainStatus: string,
  ): boolean {
    return artifactMainStatus[piece].some((s) => s === mainStatus);
  }

  private isArtifactSubStatuses(subStatuses: {
    [key: string]: number;
  }): subStatuses is ArtifactSubStatuses {
    return Object.keys(subStatuses).every((key) =>
      ArtifactSubStatuses.some((s) => s === key),
    );
  }

  private createHash() {
    return createHash("sha256")
      .update(this.set)
      .update(this.piece)
      .update(this.mainStatus)
      .update(JSON.stringify(this.subStatuses))
      .digest("hex");
  }

  public isEquals(artifact: Artifact): boolean {
    return this.hash === artifact.hash;
  }
}

class ArtifactDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "artifactDomainError";
  }
}
