import { IDocument } from "./IDocument";
import { Level, WallSurface, Wall, Furniture } from "./model/Home";
import { IEntity } from "./IEntity";
import { ViewConfig, GRrep, EntityDescriptor } from "./types";

class WallSurfaceEntity implements IEntity {
  constructor(public wallSurface: WallSurface) {}

  get id() {
    return this.wallSurface.id;
  }

  get type() {
    return this.wallSurface.type;
  }

  draw3D(viewConfig: ViewConfig) {
    return {} as any;
  }

  // no draw2D() to render nothing in 2D view
}

interface EntityInternalAPI
  extends Pick<IEntity, Exclude<keyof IEntity, "id" | "type">> {}

class Wall3DEntityInternal implements EntityInternalAPI {
  constructor(private wall: Wall) {}
  draw3D(viewConfig: ViewConfig) {
    return {} as any;
  }
  // ...
}

class Wall2DEntityInternal implements EntityInternalAPI {
  constructor(private wall: Wall) {}
  draw2D(viewConfig: ViewConfig) {
    return {} as any;
  }
  // ...
}

class WallEntity implements IEntity {
  private $3dAPI: Wall3DEntityInternal;
  private $2dAPI: Wall2DEntityInternal;
  constructor(public wall: Wall) {
    this.$3dAPI = new Wall3DEntityInternal(wall);
    this.$2dAPI = new Wall2DEntityInternal(wall);
  }

  get id() {
    return this.wall.id;
  }

  get type() {
    return this.wall.type;
  }

  draw3D(viewConfig: ViewConfig) {
    if (ViewConfig.is3D(viewConfig)) {
      return this.$3dAPI.draw3D(viewConfig);
    } else {
      return (undefined as any) as GRrep;
    }
  }

  draw2D(viewConfig: ViewConfig) {
    if (ViewConfig.is3D(viewConfig)) {
      return this.$2dAPI.draw2D(viewConfig);
    } else {
      return (undefined as any) as GRrep;
    }
  }

  getSubEntities() {
    return this.wall
      .getSurfaces()
      .map(surface => new WallSurfaceEntity(surface));
  }
}

class FurnitureEntity implements IEntity {
  constructor(public furniture: Furniture) {}

  get id() {
    return this.furniture.id;
  }

  get type() {
    return this.furniture.type;
  }

  draw3D(viewConfig: ViewConfig) {
    return {} as any;
  }
}

export default class DocumentImpl implements IDocument {
  constructor(private home: Level) {}

  get id() {
    return this.home.id;
  }

  getRootEntities() {
    const entities: IEntity[] = [];

    this.home.getWalls().forEach(wall => {
      entities.push(new WallEntity(wall));
    });

    this.home.getFurnitures().forEach(furniture => {
      entities.push(new FurnitureEntity(furniture));
    });

    return entities;
  }
}
