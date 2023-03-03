import { computeNextGeneration, createGrid, SerializedCell, willItBeAliveNextGeneration } from ".";

describe("willItBeAliveNextGeneration", () => {
  test("a cell alone dies", () => {
    // GIVEN
    const cell = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([cell]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, cell);

    // THEN
    expect(actual).toEqual(false);
  });
  test("a cell with 2 friends survives", () => {
    // GIVEN
    const cell = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, cell);

    // THEN
    expect(actual).toEqual(true);
  });

  test("a cell with 2 friends survives only if they are next to it", () => {
    // GIVEN
    const cell = {
      x: -1,
      y: 0,
    };
    const generation = createGrid([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
    ]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, cell);

    // THEN
    expect(actual).toEqual(false);
  });

  test("a cell with 3 friends survives only if they are next to it", () => {
    // GIVEN
    const cell = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: -1, y: 0 },
      { x: 2, y: -1 },
      { x: 2, y: 2 },
    ]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, cell);

    // THEN
    expect(actual).toEqual(true);
  });

  test("a cell with more than 3 friends dies", () => {
    // GIVEN
    const cell = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([
      { x: -1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 0 },
      { x: -1, y: -1 },
    ]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, cell);

    // THEN
    expect(actual).toEqual(false);
  });
});

describe("willItBeBord", () => {
  test("no neighbors -> doesn't born", () => {
    // GIVEN
    const position = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([{ x: 0, y: 0 }]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, position);

    // THEN
    expect(actual).toEqual(false);
  });

  test("3 neighbors -> comes to life", () => {
    // GIVEN
    const position = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
    ]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, position);

    // THEN
    expect(actual).toEqual(true);
  });
  test("CONTROLE >3 neighbors -> doesn't come to life", () => {
    // GIVEN
    const position = {
      x: 0,
      y: 0,
    };
    const generation = createGrid([
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]);

    // WHEN
    const actual = willItBeAliveNextGeneration(generation, position);

    // THEN
    expect(actual).toEqual(false);
  });
});

describe("compute next generation", () => {
  test("one cell -> dies", () => {
    // GIVEN
    const generation = createGrid([{ x: 0, y: 0 }]);
    // WHEN
    const actual = computeNextGeneration(generation);

    // THEN
    expect(actual.getItems()).toEqual([]);
  });

  test("3 cell horizontally -> 3 cells vertically", () => {
    // GIVEN
    const generation = createGrid([
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
    ]);
    // WHEN
    const actual = computeNextGeneration(generation);

    // THEN
    const expected: number = 0;
    expect(actual.getItems()).toEqual([
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 0, y: 0 },
    ]);
  });
});
