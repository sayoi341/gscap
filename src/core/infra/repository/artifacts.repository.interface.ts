import type { Artifacts } from "../../domain/artifacts.domain";

export interface IArtifactsRepository {
  // 作成
  create(Artifacts: Artifacts): void;

  // 取得
  get(hash: string): Promise<Artifacts>;

  // 全取得
  getAll(): Promise<Artifacts[]>;

  // 更新
  update(Artifacts: Artifacts): Promise<void>;

  // 削除
  delete(hash: string): void;
}
