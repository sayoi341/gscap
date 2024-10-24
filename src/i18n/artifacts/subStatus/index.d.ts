interface SubStatus {
  hp: string;
  atk: string;
  def: string;
  hpPersent: string;
  atkPersent: string;
  defPersent: string;
  elementalMastery: string;
  energyRecharge: string;
  critRate: string;
  critDmg: string;
}

declare const subStatus: SubStatus;

export default subStatus;
