import * as jpn from "./jpn.json";

interface SubStatuses {
  hp: string;
  atk: string;
  def: string;
  elementalMastery: string;
  energyRecharge: string;
  critRate: string;
  critDmg: string;
}

declare const subStatuses: SubStatuses;

export const subStatusesTranslateData: { [key in string]: SubStatuses } = {
  jpn: jpn,
};
