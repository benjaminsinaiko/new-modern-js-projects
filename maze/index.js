const { Engine, Render, Runner, World, Bodies } = Matter;

const CELLS = 6;
const WIDTH = 600;
const HEIGHT = 600;
const UNIT_LENGTH = WIDTH / CELLS;
const BORDER_THICKNESS = 2;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: WIDTH,
    height: HEIGHT
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(WIDTH / 2, 0, WIDTH, BORDER_THICKNESS, { isStatic: true }),
  Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, BORDER_THICKNESS, { isStatic: true }),
  Bodies.rectangle(0, HEIGHT / 2, BORDER_THICKNESS, HEIGHT, { isStatic: true }),
  Bodies.rectangle(WIDTH, HEIGHT / 2, BORDER_THICKNESS, HEIGHT, { isStatic: true })
];
World.add(world, walls);

// Maze generation
const shuffle = arr => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    [arr[counter], arr[index]] = [arr[index], arr[counter]];
  }
  return arr;
};

const grid = Array(CELLS)
  .fill(null)
  .map(() => Array(CELLS).fill(false));

const verticals = Array(CELLS)
  .fill(null)
  .map(() => Array(CELLS - 1).fill(false));

const horizontals = Array(CELLS - 1)
  .fill(null)
  .map(() => Array(CELLS).fill(false));

const startRow = Math.floor(Math.random() * CELLS);
const startColumn = Math.floor(Math.random() * CELLS);

const stepThroughCell = (row, column) => {
  // If visited cell at [row, column], then return
  if (grid[row][column]) {
    return;
  }

  // Mark cell as visted
  grid[row][column] = true;

  // Assemble randomly-ordered list of neighbors
  const neighbors = shuffle([
    [row - 1, column, 'up'],
    [row, column + 1, 'right'],
    [row + 1, column, 'down'],
    [row, column - 1, 'left']
  ]);

  // For each neighbor...
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;

    // Check if neighbor is out of bounds
    if (nextRow < 0 || nextRow >= CELLS || nextColumn < 0 || nextColumn >= CELLS) {
      continue;
    }

    // If visited neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    // Remove wall from either horizontals or verticals
    if (direction === 'left') {
      verticals[row][column - 1] = true;
    } else if (direction === 'right') {
      verticals[row][column] = true;
    } else if (direction === 'up') {
      horizontals[row - 1][column] = true;
    } else if (direction === 'down') {
      horizontals[row][column] = true;
    }

    // Visit next cell
    stepThroughCell(nextRow, nextColumn);
  }
};

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * UNIT_LENGTH + UNIT_LENGTH / 2,
      rowIndex * UNIT_LENGTH + UNIT_LENGTH,
      UNIT_LENGTH,
      10,
      {
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const wall = Bodies.rectangle(
      columnIndex * UNIT_LENGTH + UNIT_LENGTH,
      rowIndex * UNIT_LENGTH + UNIT_LENGTH / 2,
      10,
      UNIT_LENGTH,
      { isStatic: true }
    );
    World.add(world, wall);
  });
});

// Goal
const goal = Bodies.rectangle(
  WIDTH - UNIT_LENGTH / 2,
  HEIGHT - UNIT_LENGTH / 2,
  UNIT_LENGTH * 0.7,
  UNIT_LENGTH * 0.7,
  { isStatic: true }
);
World.add(world, goal);

// Ball
const ball = Bodies.circle(UNIT_LENGTH / 2, UNIT_LENGTH / 2, UNIT_LENGTH / 4);
World.add(world, ball);

// console.group('GRID');
// console.table(grid);
// console.groupEnd('GRID');

console.group('VERTICALS');
console.table(verticals);
console.groupEnd('VERTICALS');

console.group('HORIZONTALS');
console.table(horizontals);
console.groupEnd('HORIZONTALS');
