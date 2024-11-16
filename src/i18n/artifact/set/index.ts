import type { ArtifactSet } from "@/core/entity/artifact.entity";

import * as jpn from "./jpn.json";

type Set = {
  [key in ArtifactSet]: string;
};

declare const set: Set;

export const setTranslateData: { [key in string]: Set } = {
  jpn: jpn,
};
