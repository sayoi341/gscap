import { Artifact } from "@/core/entity/artifact.entity";
import type { IArtifactRepository } from "@/core/infra/repository/artifact.repository.interface";
import { ArtifactUseCase } from "@/core/usecase/artifact.usecase";
import { ArtifactUseCaseDTO } from "@/core/usecase/artifact.usecase.dto";
import { imagePreprocessor } from "@/infra/lib/imagePreprocessor";
import { recognizer } from "@/infra/lib/recognizer";
import { describe, expect, it } from "vitest";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { c } from "vite/dist/node/types.d-aGj9QkWt";

class sampleRepository implements IArtifactRepository {
  private artifacts: Artifact[] = [];

  create(
    stars: number,
    set: string,
    piece: string,
    mainStatus: string,
    subStatus: { [key: string]: number },
  ): Artifact {
    const artifact = new Artifact(stars, set, piece, mainStatus, subStatus);
    this.artifacts.push(artifact);
    return artifact;
  }

  get(hash: string): Promise<Artifact> {
    const artifact = this.artifacts.find((artifact) => artifact.hash === hash);
    if (artifact) {
      return Promise.resolve(artifact);
    }
    return Promise.reject(new Error("Not Found"));
  }

  getAll(): Promise<Artifact[]> {
    return Promise.resolve(this.artifacts);
  }

  update(artifact: Artifact): Promise<void> {
    const index = this.artifacts.findIndex(
      (item) => item.hash === artifact.hash,
    );
    if (index >= 0) {
      this.artifacts[index] = artifact;
      return Promise.resolve();
    }
    return Promise.reject(new Error("Not Found"));
  }

  delete(hash: string): void {
    const index = this.artifacts.findIndex((item) => item.hash === hash);
    if (index >= 0) {
      this.artifacts.splice(index, 1);
    }
  }
}

describe("Artifact::UseCase", async () => {
  const artifactUseCase = new ArtifactUseCase(new sampleRepository());

  it("recognizeArtifact 聖遺物情報の取得 WQHD 花 雷のような怒り", async () => {
    const artifactImage = await readFile(
      resolve("test/core/usecase/assets/artifact.jpeg"),
    );

    const image = new ArtifactUseCaseDTO(artifactImage);

    const artifact = await artifactUseCase.recognizeArtifact(
      image,
      recognizer,
      imagePreprocessor,
      "jpn",
    );
    expect(artifact.stars).toBe(5);
    expect(artifact.set).toBe("thunderingFury");
    expect(artifact.piece).toBe("flowerOfLife");
    expect(artifact.mainStatus).toBe("hp");
    expect(artifact.subStatuses).toEqual({
      def: 21,
      atkPercent: 5.8,
      critRate: 12.8,
      critDmg: 18.7,
    });
  });

  it("recognizeArtifact 聖遺物情報の取得 FHD 時計 しめ縄", async () => {
    const artifactImage = await readFile(
      resolve("test/core/usecase/assets/artifact2.png"),
    );

    const image = new ArtifactUseCaseDTO(artifactImage);

    const artifact = await artifactUseCase.recognizeArtifact(
      image,
      recognizer,
      imagePreprocessor,
      "jpn",
    );

    expect(artifact.stars).toBe(5);
    expect(artifact.set).toBe("shimenawasReminiscence");
    expect(artifact.piece).toBe("sandsOfEon");
    expect(artifact.mainStatus).toBe("atkPercent");
    expect(artifact.subStatuses).toEqual({
      hp: 239,
      hpPercent: 5.8,
      critRate: 12.4,
      critDmg: 17.9,
    });
  });
});
