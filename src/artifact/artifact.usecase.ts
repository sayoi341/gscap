import type { Artifact } from "./artifact.domain";
import type { IArtifactRepository } from "./artifact.irepository";

export class ArtifactUseCase {
  // ここにリポジトリを受け取るコンストラクタを追加
  constructor(private readonly repository: IArtifactRepository) {}

  // 聖遺物情報の取得
  getArtifact() {}

  // 聖遺物情報の送信
  sendArtifact() {}
}
