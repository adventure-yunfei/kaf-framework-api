import {
  EntityType,
  GRrep as GRrep3D,
  IPickable3D,
  InferenceSource3D,
  InferenceConfig,
  GRrep2D,
  IPickable2D,
  InferenceSource2D,
  ViewConfig
} from "./types";
import { Curve3D, Curve2D } from "./math";

export interface IEntity {
  id: string;
  type: EntityType;

  /** should be implemented by framework */
  // getParentEntity(): IEntity3D | undefined;

  getSubEntities?(): IEntity[];

  draw3D?(viewConfig: ViewConfig): GRrep3D;
  draw2D?(viewConfig: ViewConfig): GRrep2D;

  /** Default to draw() bounding box */
  getOutline3D?(viewConfig: ViewConfig): Curve3D[];
  getOutline2D?(viewConfig: ViewConfig): Curve2D[];

  /**
   * Default to use draw() result as pickable
   *
   * Override to specify:
   *  - custom pickable geometry
   *  - non-pickable by return false
   */
  getPickable3D?(viewConfig: ViewConfig): IPickable3D | false;
  getPickable2D?(viewConfig: ViewConfig): IPickable2D | false;

  getInferenceSources3D?(inferenceConfig: InferenceConfig): InferenceSource3D[];
  getInferenceSources2D?(inferenceConfig: InferenceConfig): InferenceSource2D[];
}
