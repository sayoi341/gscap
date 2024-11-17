export class ArtifactUseCaseDTO {
  public readonly artifactImage: Buffer;

  constructor(artifactImage: Buffer) {
    this.artifactImage = artifactImage;
  }
}
