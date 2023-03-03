export type Cell = {
  x: number;
  y: number;
};

export type Position = {
  x: number;
  y: number;
};

export type SerializedCell = string;
export type SerializedPosition = string;

export type Grid = {
  getLength: () => number;
  filter: (iteratee: (position: Position) => boolean) => Grid;
  getItems: () => Cell[];
  has: (position: Position) => boolean;
  map: (iteratee: (position: Position) => Grid) => Grid;
};

const SHIFT_ARRAY = [
  { dx: -1, dy: -1 },
  { dx: -1, dy: 0 },
  { dx: -1, dy: 1 },
  { dx: 0, dy: -1 },
  { dx: 0, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 1, dy: 1 },
];

export const createGrid = (positions: Position[]): Grid => {
  const positionsSet = new Set(positions.map(serializeCell));
  return {
    getLength: () => [...positionsSet].length,
    filter: (iteratee: (position: Position) => boolean) =>
      createGrid([...positionsSet].map(deserialized).filter(iteratee)),
    getItems: () => [...positionsSet].map(deserialized),
    has: (position: Position) => {
      const serializedPosition = serializeCell(position);
      return positionsSet.has(serializedPosition);
    },
    map: (iteratee: (position: Position) => Grid) =>
      createGrid([...positionsSet].map(deserialized).flatMap((position) => iteratee(position).getItems())),
  };
};

const serializeCell = (cell: Cell): SerializedCell => `${cell.x} | ${cell.y}`;
const deserialized = (serialized: string): Cell => {
  const splitString = serialized.split(" | ");

  return {
    x: parseInt(splitString[0]),
    y: parseInt(splitString[1]),
  };
};

const computeNearPositions = ({ x, y }: Cell): Grid => {
  const nearPositions = SHIFT_ARRAY.map(({ dx, dy }) => ({ x: x + dx, y: y + dy }));

  return createGrid(nearPositions);
};
const computeNeighbors = (currentGeneration: Grid, cell: Cell): Grid => {
  const nearPositions = computeNearPositions(cell);
  return nearPositions.filter((position) => currentGeneration.has(position));
};

export const willItBeAliveNextGeneration = (currentGeneration: Grid, position: Position): boolean => {
  const numberOfNeighbors = computeNeighbors(currentGeneration, position).getLength();
  const isPositionACell = currentGeneration.has(position);
  if (isPositionACell) {
    return numberOfNeighbors === 2 || numberOfNeighbors === 3;
  }
  return numberOfNeighbors === 3;
};

const computeGenerationNearPositions = (generation: Grid): Grid => {
  const nearPositions = generation.map(({ x, y }) => {
    return createGrid(SHIFT_ARRAY.map(({ dx, dy }) => ({ x: x + dx, y: y + dy })));
  });

  return nearPositions;
};
const computeGenerationAndNearPositions = (generation: Grid): Grid => {
  const generationNearPositions = computeGenerationNearPositions(generation);

  return createGrid([...generationNearPositions.getItems(), ...generation.getItems()]);
};

export const computeNextGeneration = (currentGeneration: Grid): Grid => {
  const positionsThatCouldBeCells = computeGenerationAndNearPositions(currentGeneration);
  const alivedCellsNextGeneration = positionsThatCouldBeCells.filter((position) =>
    willItBeAliveNextGeneration(currentGeneration, position)
  );
  return alivedCellsNextGeneration;
};
