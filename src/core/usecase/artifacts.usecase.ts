import type { IArtifactsRepository } from "../infra/repository/artifacts.repository.interface";

export class ArtifactUseCase {
  // ここにリポジトリを受け取るコンストラクタを追加
  constructor(private readonly repository: IArtifactsRepository) {}

  // 聖遺物情報の取得
  getArtifact() {}

  // 聖遺物情報の送信
  sendArtifact() {}
}
