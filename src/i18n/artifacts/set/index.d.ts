import type { ArtifactsSet } from "../../../core/domain/artifacts.domain";

type Set = {
  [key in ArtifactsSet]: string;
};

declare const set: Set;

export default set;
