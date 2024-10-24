import { createHash } from "node:crypto";

export type ArtifactsSet =
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
  | "desertPavilionChronicle" // 砂上の楼閣の史話
  | "flowerOfParadiseLost" // 楽園の絶花
  | "nymphsDream" // 水仙の夢
  | "vourukashasGlow" // 花海甘露の光
  | "MarechausseeHunter" // ファントムハンター
  | "goldenTroupe" // 黄金の劇団
  | "songOfDaysPast" // 在りし日の歌
  | "nighttimeWhispersInTheEchoingWoods" // 残響の森で囁かれる夜話
  | "fragmentOfHarmonicWhimsy" // 諧律奇想の断章
  | "unfinishedReverie" // 遂げられなかった想い
  | "scrollOfTheHeroOfCinderCity" // 灰燼の都に立つ英雄の絵巻
  | "obsidianCodex"; // 黒曜の秘典

export type ArtifactsPiece =
  | "flowerOfLife"
  | "plumeOfDeath"
  | "sandsOfEon"
  | "gobletOfEonothem"
  | "circletOfLogos";

const artifactsMainStatusMap = {
  flowerOfLife: ["hp"],
  plumeOfDeath: ["atk"],
  sandsOfEon: [
    "atkPersent",
    "defPersent",
    "hpPersent",
    "elementalMastery", // 元素熟知
    "energyRecharge", // 元素チャージ効率
  ],
  gobletOfEonothem: [
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
    "geoDmgBonus", // 岩ダメージバフ
  ],
  circletOfLogos: [
    "atkPersent",
    "defPersent",
    "hpPersent",
    "elementalMastery", // 元素熟知
    "critRate", // 会心率
    "critDmg", // 会心ダメージ
    "healingBonus", // 治癒バフ
  ],
} as const;

type ArtifactsMainStatus<T extends ArtifactsPiece> =
  (typeof artifactsMainStatusMap)[T][number];

type ArtifactsSubStatus = {
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

export class Artifacts {
  public readonly hash: string;
  public readonly stars: number;
  public readonly set: ArtifactsSet;
  public readonly piece: ArtifactsPiece;
  public readonly mainStatus: ArtifactsMainStatus<ArtifactsPiece>;
  public readonly subStatus: ArtifactsSubStatus;

  constructor(
    stars: number,
    set: string,
    piece: string,
    mainStatus: string,
    subStatus: { [key: string]: number },
  ) {
    // starsが1~5かチェック
    if (stars < 1 || 5 < stars) {
      throw new ArtifactsDomainError("invalid artifacts stars");
    }
    this.stars = stars;

    // setがArtifactsSet型に含まれるかチェック
    // todo: この型チェックはどうにかしたい
    this.set = set as ArtifactsSet;

    // PieceがArtifactsPiece型に含まれるかチェック
    // todo: この型チェックはどうにかしたい
    this.piece = piece as ArtifactsPiece;

    // mainStatusがPieceで変化した型に対応しているかチェック
    if (!artifactsMainStatusMap[piece].includes(mainStatus)) {
      throw new ArtifactsDomainError("invalid artifacts main status");
    }

    // mainStatusがArtifactsMainStatus型に含まれるかチェック
    if (!(mainStatus as ArtifactsMainStatus<ArtifactsPiece>)) {
      throw new ArtifactsDomainError("invalid artifacts main status");
    }
    this.mainStatus = mainStatus as ArtifactsMainStatus<ArtifactsPiece>;

    // subStatusが4つ以下かチェック
    if (Object.keys(subStatus).length > 4) {
      throw new ArtifactsDomainError(
        "artifacts sub status should be less than 4",
      );
    }

    // subStatusがmainStatusと異なるかチェック
    if (Object.keys(subStatus).includes(mainStatus)) {
      throw new ArtifactsDomainError(
        "artifacts sub status should not same main status",
      );
    }

    // subStatusがArtifactsSubStatus型に含まれるかチェック
    if (
      Object.keys(subStatus).some((key) => !(key as keyof ArtifactsSubStatus))
    ) {
      throw new ArtifactsDomainError("invalid artifacts sub status");
    }
    this.subStatus = subStatus as ArtifactsSubStatus;

    this.hash = this.createHash();
  }

  createHash() {
    return createHash("sha256")
      .update(this.set)
      .update(this.piece)
      .update(this.mainStatus)
      .update(JSON.stringify(this.subStatus))
      .digest("hex");
  }
}

class ArtifactsDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "artifactsDomainError";
  }
}
