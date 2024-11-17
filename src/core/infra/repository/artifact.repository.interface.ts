import type { Artifact } from "@/core/entity/artifact.entity";

export interface IArtifactRepository {
  // 作成
  create(
    stars: number,
    set: string,
    piece: string,
    mainStatus: string,
    subStatus: { [key: string]: number },
  ): Artifact;

  // 取得
  get(hash: string): Promise<Artifact>;

  // 全取得
  getAll(): Promise<Artifact[]>;

  // 更新
  update(artifact: Artifact): Promise<void>;

  // 削除
  delete(hash: string): void;
}
