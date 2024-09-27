import type { Artifact } from "./artifact.domain";

export interface IArtifactRepository {
  // 作成
  create(artifact: Artifact): void;

  // 取得
  get(hash: string): Promise<Artifact>;

  // 全取得
  getAll(): Promise<Artifact[]>;

  // 更新
  update(artifact: Artifact): Promise<void>;

  // 削除
  delete(hash: string): void;
}
