export class Element {
  id: string;
  type: symbol;
}

export class WallSurface extends Element {}

export class Wall extends Element {
  getSurfaces(): WallSurface[] {
    //
    return [];
  }
}

export class Furniture extends Element {}

export class Level extends Element {
  getWalls(): Wall[] {
    //
    return [];
  }

  getFurnitures(): Furniture[] {
    //
    return [];
  }
}
