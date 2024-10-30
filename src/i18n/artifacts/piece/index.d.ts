import type { ArtifactsPiece } from "../../../core/domain/artifacts.domain";

type Piece = {
  [key in ArtifactsPiece]: string;
};

declare const piece: Piece;

export default piece;
