import * as THREE from "three";
import * as PIXI from "./PIXI";
import * as math from "./math";

export interface EntityType {}

export interface GRrep {
  getMesh(): THREE.Mesh;
}

export interface GRrep2D {
  getPixiObject(): PIXI.PixiObject;
}

export declare class ViewConfig3D {
  protected __ViewConfig3DTag: boolean;
}

export declare class ViewConfig2D {
  protected __ViewConfig3DTag: boolean;
}

export interface ViewConfig {}
export const ViewConfig = {
  is3D(viewConfig: ViewConfig): boolean {
    //
    return true;
  }
};

export interface IGeometry3D {
  intersect(ray: THREE.Raycaster): math.Vector3 | undefined;
  getOutline(): math.Curve3D[];
}

export interface IGeometry2D {
  intersect(point: math.Vector2): math.Vector2 | boolean | undefined;
  getOutline(): math.Curve2D[];
}

export interface IPickable3D {
  geometry: IGeometry3D;
}

export interface IPickable2D {
  geometry: IGeometry2D;
}

export interface InferenceSource3D {}

export interface InferenceSource2D {}

export interface InferenceConfig {
  viewConfig: ViewConfig;
  inferenceMode: symbol;
}

export interface EntityDescriptor {
  id: string;
  type: EntityType;
}
