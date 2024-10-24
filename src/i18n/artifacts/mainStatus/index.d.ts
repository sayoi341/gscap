interface MainStatus {
  hp: string;
  atk: string;

  hpPersent: string;
  atkPersent: string;
  defPersent: string;

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

export default mainStatus;
