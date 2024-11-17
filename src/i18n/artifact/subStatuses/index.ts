import * as jpn from "./jpn.json";

const artifactSubStatuses = [
  "hp",
  "atk",
  "def",
  "elementalMastery",
  "energyRecharge",
  "critRate",
  "critDmg",
] as const;

type ArtifactSubStatuses = (typeof artifactSubStatuses)[number];

type SubStatuses = {
  [key in ArtifactSubStatuses]: string;
};

declare const subStatuses: SubStatuses;

export const subStatusesTranslateData: { [key in string]: SubStatuses } = {
  jpn: jpn,
};
