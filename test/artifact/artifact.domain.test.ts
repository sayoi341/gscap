import { describe, expect, it } from "vitest";
import { Artifact } from "../../src/artifact/artifact.domain";

describe("Artifact", () => {
  it("インスタンス作成", () => {
    const artifact = new Artifact(
      5,
      "gladiatorsFinale",
      "sands",
      "atkPersent",
      {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      },
    );

    expect(artifact.stars).toBe(5);
    expect(artifact.set).toBe("gladiatorsFinale");
    expect(artifact.position).toBe("sands");
    expect(artifact.mainStatus).toBe("atkPersent");
    expect(artifact.subStatus).toEqual({
      energyRecharge: 10,
      critRate: 10,
      critDmg: 10,
    });
  });

  it("ハッシュの確認", () => {
    const artifact = new Artifact(
      5,
      "gladiatorsFinale",
      "sands",
      "atkPersent",
      {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      },
    );

    expect(artifact.hash).toBe(
      "733be50f055a8a2f5a831c3048b0f0a6fda15f2f65c7580d8af298bc9aa897c3",
    );
  });

  it("部位とメインステータスの不一致", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sands", "hp", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        hp: 10,
      });
    }).toThrow("invalid artifact main status");
  });

  it("サブステータスが5つ以上", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sands", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        hp: 10,
        atk: 10,
      });
    }).toThrow("artifact sub status should be less than 4");
  });

  it("サブステータスがメインステータスと同じ", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sands", "atkPersent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        atkPersent: 10,
      });
    }).toThrow("artifact sub status should not same main status");
  });
});
