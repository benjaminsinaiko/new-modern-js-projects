const { Engine, Render, Runner, World, Bodies } = Matter;

const CELLS = 3;
const WIDTH = 600;
const HEIGHT = 600;

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
  Bodies.rectangle(WIDTH / 2, 0, WIDTH, 40, { isStatic: true }),
  Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 40, { isStatic: true }),
  Bodies.rectangle(0, HEIGHT / 2, 40, HEIGHT, { isStatic: true }),
  Bodies.rectangle(WIDTH, HEIGHT / 2, 40, HEIGHT, { isStatic: true })
];
World.add(world, walls);

// Maze generation
const shuffle = arr => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;

    // const temp = arr[counter];
    // arr[counter] = arr[index];
    // arr[index] = temp;

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
  // console.table(neighbors);

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

console.group('GRID');
console.table(grid);
console.groupEnd('GRID');

console.group('VERTICALS');
console.table(verticals);
console.groupEnd('VERTICALS');

console.group('HORIZONTALS');
console.table(horizontals);
console.groupEnd('HORIZONTALS');
