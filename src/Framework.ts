import { mapValues, forIn } from "lodash";
import * as math from "./math";
import {
  EntityDescriptor,
  ViewConfig,
  InferenceConfig,
  InferenceSource3D,
  GRrep,
  GRrep2D,
  InferenceSource2D
} from "./types";
import { IDocument } from "./IDocument";
import { IEntity } from "./IEntity";

export interface PickedEntity extends EntityDescriptor {}

export interface Framework {
  pick(ray: THREE.Raycaster): PickedEntity | undefined;

  inference(
    inferenceMode: symbol,
    ray: THREE.Raycaster
  ): math.Vector3 | undefined;

  hidden: {
    /** only for root entities */
    getHiddenSet(): EntityDescriptor[];
    addHiddenItem(entity: EntityDescriptor): void;
    removeHiddenItem(entity: EntityDescriptor): void;
  };
}

function getParentEntity(entity: IEntity): IEntity | undefined {
  // entity.getParentEntity();
  return undefined;
}

function meshIntersect(
  mesh: GRrep,
  ray: THREE.Raycaster
): math.Vector3 | undefined {
  //
  return undefined;
}

function mesh2DIntersect(
  mesh2D: GRrep2D,
  mousePoint: math.Vector2
): math.Vector2 | undefined {
  //
  return undefined;
}

function autoRun(fn: () => void) {
  //
  fn();
}

function sortByDistance(pickedEntities: PickedEntity[]): PickedEntity[] {
  //
  return [];
}

function getOutlineView(outline: math.Curve3D[] | THREE.Box3): GRrep {
  return "" as any;
}

function getOutline2DView(outline: math.Curve2D[] | GRrep2D): GRrep2D {
  return "" as any;
}

class Scene3DManager {
  addViews(fn: () => GRrep[]) {
    const viewId = Symbol("new-view-id");
    autoRun(() => {
      const view = fn();
      this.addOrReplaceViews(viewId, view);
    });
  }
  getRay(mousePoint: math.Vector2): THREE.Raycaster {
    return "" as any;
  }
  addOrReplaceViews(viewId: symbol, view: GRrep[]) {
    // ...
  }
}

class Scene2DManager {
  addViews(fn: () => GRrep2D[]) {
    const viewId = Symbol("new-view-id");
    autoRun(() => {
      const view = fn();
      this.addOrReplaceViews(viewId, view);
    });
  }
  unproject(point: math.Vector2): math.Vector3 {
    //
    return "" as any;
  }
  addOrReplaceViews(viewId: symbol, view: GRrep2D[]) {
    // ...
  }
}

interface ViewContainer {
  config: ViewConfig;
  sceneManager: Scene3DManager | Scene2DManager;
}

const VIEW_MAIN = Symbol("view-main");
const VIEW_HIGHTLIGHT = Symbol("view-highlight");

export class FrameworkImpl implements Framework {
  private documents: IDocument[];
  private selectedEntities: EntityDescriptor[];
  private views: {
    [name: string]: ViewContainer;
  } = {};

  setupViews(views: { [name: string]: ViewConfig }) {
    this.views = mapValues(views, config => {
      return {
        config,
        sceneManager: ViewConfig.is3D(config)
          ? new Scene2DManager()
          : new Scene2DManager()
      };
    });
  }

  pick(mousePoint: math.Vector2): PickedEntity | undefined {
    const selectedEntitiesAndAncestors = this.getEntitiesAndAncestors(
      this.selectedEntities
    );

    const pickableEntities: IEntity[] = [];
    const onCandidateEntity = (entity: IEntity) => {
      if (selectedEntitiesAndAncestors.has(entity) && entity.getSubEntities) {
        // nested pick
        entity.getSubEntities().forEach(onCandidateEntity);
      } else {
        pickableEntities.push(entity);
      }
    };
    this.documents.forEach(doc => {
      doc
        .getRootEntities()
        .filter(entity => this.isEntityVisible(entity))
        .forEach(onCandidateEntity);
    });

    const pickedEntities: PickedEntity[] = [];
    const activeView = this.getActiveView(mousePoint);
    if (ViewConfig.is3D(activeView.config)) {
      // for 3D
      const ray = (activeView.sceneManager as Scene3DManager).getRay(
        mousePoint
      );
      pickableEntities.forEach(entity => {
        if (entity.getPickable3D) {
          const pickable = entity.getPickable3D(activeView.config);
          if (pickable && pickable.geometry.intersect(ray)) {
            pickedEntities.push(entity);
          }
        } else if (entity.draw3D) {
          // default to pick by entity.draw()
          const mesh = entity.draw3D(activeView.config);
          if (meshIntersect(mesh, ray)) {
            pickedEntities.push(entity);
          }
        }
      });

      return sortByDistance(pickableEntities)[0];
    } else {
      // for 2D
      pickableEntities.forEach(entity => {
        if (entity.getPickable2D) {
          const pickable = entity.getPickable2D(activeView.config);
          if (pickable && pickable.geometry.intersect(mousePoint)) {
            pickedEntities.push(entity);
          }
        } else if (entity.draw2D) {
          // default to pick by entity.draw()
          const mesh = entity.draw2D(activeView.config);
          if (mesh2DIntersect(mesh, mousePoint)) {
            pickedEntities.push(entity);
          }
        }
      });
      return sortByDistance(pickableEntities)[0];
    }
  }

  inference(
    inferenceMode: symbol,
    ray: THREE.Raycaster
  ): math.Vector3 | undefined {
    const activeView = this.getActiveView();
    const inferenceConfig: InferenceConfig = {
      inferenceMode,
      viewConfig: activeView.config
    };
    if (ViewConfig.is3D(activeView.config)) {
      // for 3D
      const sources = this.documents.reduce<InferenceSource3D[][]>(
        (acc, doc) => {
          const availableEntities = doc
            .getRootEntities()
            .filter(entity => this.isEntityVisible(entity));
          availableEntities.forEach(entity => {
            if (entity.getInferenceSources3D) {
              acc.push(entity.getInferenceSources3D(inferenceConfig));
            }
          });
          if (doc.getInferenceSources3D) {
            acc.push(
              doc.getInferenceSources3D(
                this.hidden.getHiddenSet(),
                inferenceConfig
              )
            );
          }
          return acc;
        },
        []
      );

      const doInference = (
        inferenceSources: InferenceSource3D[][],
        ray: THREE.Raycaster
      ): math.Vector3 | undefined => {
        //
        return undefined;
      };
      return doInference(sources, ray);
    } else {
      // for 2D
      const sources = this.documents.reduce<InferenceSource2D[][]>(
        (acc, doc) => {
          const availableEntities = doc
            .getRootEntities()
            .filter(entity => this.isEntityVisible(entity));
          availableEntities.forEach(entity => {
            if (entity.getInferenceSources2D) {
              acc.push(entity.getInferenceSources2D(inferenceConfig));
            }
          });
          if (doc.getInferenceSources2D) {
            acc.push(
              doc.getInferenceSources2D(
                this.hidden.getHiddenSet(),
                inferenceConfig
              )
            );
          }
          return acc;
        },
        []
      );

      const doInference2D = (
        inferenceSources: InferenceSource2D[][],
        mousePoint: math.Vector2
      ): math.Vector2 | undefined => {
        //
        return undefined;
      };
      const point2d = doInference2D(sources, ray);
      // unproject 2d to 3d to get the same coordinate. useful for multi-view app.
      // but the original result should also be returned for single 2d view app (modify inference result api)
      return (
        point2d &&
        (activeView.sceneManager as Scene2DManager).unproject(point2d)
      );
    }
  }

  draw() {
    forIn(this.views, view => {
      autoRun(() => {
        if (ViewConfig.is3D(view.config)) {
          // for 3D
          (view.sceneManager as Scene3DManager).addOrReplaceViews(
            VIEW_MAIN,
            this.documents.reduce<GRrep[]>((acc, doc) => {
              acc.push(
                ...doc
                  .getRootEntities()
                  .filter(
                    entity => this.isEntityVisible(entity) && entity.draw3D
                  )
                  .map(entity => entity.draw3D!(view.config))
              );
              return acc;
            }, [])
          );
        } else {
          // for 2D
          (view.sceneManager as Scene2DManager).addOrReplaceViews(
            VIEW_MAIN,
            this.documents.reduce<GRrep2D[]>((acc, doc) => {
              acc.push(
                ...doc
                  .getRootEntities()
                  .filter(
                    entity => this.isEntityVisible(entity) && entity.draw2D
                  )
                  .map(entity => entity.draw2D!(view.config))
              );
              return acc;
            }, [])
          );
        }
      });
    });
  }

  highlight() {
    forIn(this.views, view => {
      autoRun(() => {
        if (ViewConfig.is3D) {
          // for 3D
          (view.sceneManager as Scene3DManager).addOrReplaceViews(
            VIEW_HIGHTLIGHT,
            this.getSelectedEntities().map(entity => {
              const pickable =
                entity.getPickable3D && entity.getPickable3D(view.config);
              const highlightOutline = pickable
                ? pickable.geometry.getOutline()
                : entity.getOutline3D
                ? entity.getOutline3D(view.config)
                : entity.draw3D
                ? entity.draw3D(view.config).getMesh().geometry.boundingBox
                : [];
              return getOutlineView(highlightOutline);
            })
          );
        } else {
          // for 2D
          (view.sceneManager as Scene2DManager).addOrReplaceViews(
            VIEW_HIGHTLIGHT,
            this.getSelectedEntities().map(entity => {
              const pickable =
                entity.getPickable2D && entity.getPickable2D(view.config);
              const highlightOutline = pickable
                ? pickable.geometry.getOutline()
                : entity.getOutline2D
                ? entity.getOutline2D(view.config)
                : entity.draw2D
                ? entity.draw2D(view.config)
                : [];
              return getOutline2DView(highlightOutline);
            })
          );
        }
      });
    });
  }

  hidden = {
    getHiddenSet(): EntityDescriptor[] {
      //
      return [];
    },
    addHiddenItem(entity: EntityDescriptor): void {
      //
    },
    removeHiddenItem(entity: EntityDescriptor): void {
      //
    }
  };

  private getActiveView(mousePoint?: math.Vector2): ViewContainer {
    // this.views...
    return "" as any;
  }

  private isEntityVisible(entity: IEntity): boolean {
    return this.hidden
      .getHiddenSet()
      .every(
        hiddenEntity =>
          entity.type !== hiddenEntity.type && entity.id !== hiddenEntity.id
      );
  }

  private getSelectedEntities(): IEntity[] {
    return this.documents.reduce<IEntity[]>((acc, doc) => {
      this.cachedGetAllEntities(doc).forEach(entity => {
        if (
          this.selectedEntities.some(
            selEntity =>
              selEntity.type === entity.type && selEntity.id === entity.id
          )
        ) {
          acc.push(entity);
        }
      });
      return acc;
    }, []);
  }

  private cachedGetAllEntities(document: IDocument): IEntity[] {
    // get all entities inside document, including nested ones
    return [];
  }

  private getEntitiesAndAncestors(entities: IEntity[]): Set<IEntity> {
    return entities.reduce<Set<IEntity>>((acc, entity) => {
      acc.add(entity);

      let parent = getParentEntity(entity);
      while (parent) {
        acc.add(parent);
        parent = getParentEntity(parent);
      }

      return acc;
    }, new Set());
  }
}
