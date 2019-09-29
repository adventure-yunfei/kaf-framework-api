import {
  InferenceConfig,
  InferenceSource3D,
  InferenceSource2D,
  EntityDescriptor
} from "./types";
import { IEntity } from "./IEntity";

export interface IDocument {
  id: string;

  getRootEntities(): IEntity[];

  /**
   * Used to provide inference sources BETWEEN or OUTSIDE entities.
   *
   * (although sources for one entity could also be returned, it's not recommended to do so)
   */
  getInferenceSources3D?(
    excludedEntities: EntityDescriptor[],
    inferenceConfig: InferenceConfig
  ): InferenceSource3D[];
  getInferenceSources2D?(
    excludedEntities: EntityDescriptor[],
    inferenceConfig: InferenceConfig
  ): InferenceSource2D[];
}
