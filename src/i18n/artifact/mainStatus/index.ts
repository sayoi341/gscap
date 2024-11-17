import * as jpn from "./jpn.json";

const artifactMainStatus = [
  "hp",
  "atk",
  "def",
  "elementalMastery",
  "energyRecharge",
  "physicalDmgBonus",
  "pyroDmgBonus",
  "hydroDmgBonus",
  "dendroDmgBonus",
  "electroDmgBonus",
  "anemoDmgBonus",
  "cryoDmgBonus",
  "geoDmgBonus",
  "critRate",
  "critDmg",
  "healingBonus",
] as const;

type ArtifactMainStatus = (typeof artifactMainStatus)[number];

type MainStatus = {
  [key in ArtifactMainStatus]: string;
};

declare const mainStatus: MainStatus;

export const mainStatusTranslateData: { [key in string]: MainStatus } = {
  jpn: jpn,
};
