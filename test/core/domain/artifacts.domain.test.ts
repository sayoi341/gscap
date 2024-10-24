import { describe, expect, it } from "vitest";
import { Artifacts } from "../../../src/core/domain/artifacts.domain";

describe("Artifact::Domain", () => {
  it("インスタンス作成", () => {
    const artifact = new Artifacts(
      5,
      "gladiatorsFinale",
      "sandsOfEon",
      "atkPersent",
      {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      },
    );

    expect(artifact.stars).toBe(5);
    expect(artifact.set).toBe("gladiatorsFinale");
    expect(artifact.piece).toBe("sandsOfEon");
    expect(artifact.mainStatus).toBe("atkPersent");
    expect(artifact.subStatus).toEqual({
      energyRecharge: 10,
      critRate: 10,
      critDmg: 10,
    });
  });

  it("ハッシュの確認", () => {
    const artifact = new Artifacts(
      5,
      "gladiatorsFinale",
      "sandsOfEon",
      "atkPersent",
      {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      },
    );

    expect(artifact.hash).toBe(
      "fdcf7dc32bfd4dfe59b41f48648394fe3ed29068b1267878fae137d271d59727",
    );
  });

  it("星数が1未満", () => {
    expect(() => {
      new Artifacts(0, "gladiatorsFinale", "flowerOfLife", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifacts stars");
  });

  it("星数が6以上", () => {
    expect(() => {
      new Artifacts(6, "gladiatorsFinale", "flowerOfLife", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifacts stars");
  });

  /*
  it("セットが存在しない", () => {
    expect(() => {
      new Artifacts(5, "invalidSet", "sands", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifacts set");
  });
  */

  /*
  it("部位が存在しない", () => {
    expect(() => {
      new Artifacts(5, "gladiatorsFinale", "invalidPosition", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifacts position");
  });
  */

  it("部位とメインステータスの不一致", () => {
    expect(() => {
      new Artifacts(5, "gladiatorsFinale", "sandsOfEon", "hp", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        hp: 10,
      });
    }).toThrow("invalid artifacts main status");
  });

  it("サブステータスが5つ以上", () => {
    expect(() => {
      new Artifacts(5, "gladiatorsFinale", "sandsOfEon", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        hp: 10,
        atk: 10,
      });
    }).toThrow("artifacts sub status should be less than 4");
  });

  it("サブステータスがメインステータスと同じ", () => {
    expect(() => {
      new Artifacts(5, "gladiatorsFinale", "sandsOfEon", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        atkPersent: 10,
      });
    }).toThrow("artifacts sub status should not same main status");
  });
});
