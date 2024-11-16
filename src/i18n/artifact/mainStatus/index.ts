import * as jpn from "./jpn.json";

interface MainStatus {
  hp: string;
  atk: string;
  def: string;

  elementalMastery: string;
  energyRecharge: string;

  physicalDmgBonus: string;
  pyroDmgBonus: string;
  hydroDmgBonus: string;
  dendroDmgBonus: string;
  electroDmgBonus: string;
  anemoDmgBonus: string;
  cryoDmgBonus: string;
  geoDmgBonus: string;

  critRate: string;
  critDmg: string;
  healingBonus: string;
}

declare const mainStatus: MainStatus;

export const mainStatusTranslateData: { [key in string]: MainStatus } = {
  jpn: jpn,
};
