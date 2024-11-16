import type { ArtifactPiece } from "@/core/entity/artifact.entity";

import * as jpn from "./jpn.json";

type Piece = {
  [key in ArtifactPiece]: string;
};

declare const piece: Piece;

export const pieceTranslateData: { [key in string]: Piece } = {
  jpn: jpn,
};
