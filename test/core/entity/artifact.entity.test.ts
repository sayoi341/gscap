import { Artifact } from "@/core/entity/artifact.entity";
import { describe, expect, it } from "vitest";

describe("Artifact::Domain", () => {
  it("インスタンス作成", () => {
    const artifact = new Artifact(
      5,
      "gladiatorsFinale",
      "sandsOfEon",
      "atkPercent",
      {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      },
    );

    expect(artifact.stars).toBe(5);
    expect(artifact.set).toBe("gladiatorsFinale");
    expect(artifact.piece).toBe("sandsOfEon");
    expect(artifact.mainStatus).toBe("atkPercent");
    expect(artifact.subStatuses).toEqual({
      energyRecharge: 10,
      critRate: 10,
      critDmg: 10,
    });
  });

  it("ハッシュの確認", () => {
    const artifact = new Artifact(
      5,
      "gladiatorsFinale",
      "sandsOfEon",
      "atkPercent",
      {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      },
    );

    expect(artifact.hash).toBe(
      "3ee8f725f634c7c17a4084ee0eadf016caab2171c2726575d7a01e09c7c16621",
    );
  });

  it("starsが1未満", () => {
    expect(() => {
      new Artifact(0, "gladiatorsFinale", "flowerOfLife", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifact stars");
  });

  it("starsが6以上", () => {
    expect(() => {
      new Artifact(6, "gladiatorsFinale", "flowerOfLife", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifact stars");
  });

  it("setが不正", () => {
    expect(() => {
      new Artifact(5, "invalidSet", "sands", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifact set");
  });

  it("pieceが不正", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "invalidPosition", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
      });
    }).toThrow("invalid artifact piece");
  });

  it("main statusが不正", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sandsOfEon", "hp", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        hp: 10,
      });
    }).toThrow("invalid artifact main status");
  });

  it("sub statusesが5つ以上", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sandsOfEon", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        hp: 10,
        atk: 10,
      });
    }).toThrow("artifact sub statuses should be less than 4");
  });

  it("sub statusesがmain statusと同じ", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sandsOfEon", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        atkPercent: 10,
      });
    }).toThrow("artifact sub statuses should not same main status");
  });

  it("sub statusesが不正", () => {
    expect(() => {
      new Artifact(5, "gladiatorsFinale", "sandsOfEon", "atkPercent", {
        energyRecharge: 10,
        critRate: 10,
        critDmg: 10,
        invalidStatus: 10,
      });
    }).toThrow("invalid artifact sub statuses");
  });
});
