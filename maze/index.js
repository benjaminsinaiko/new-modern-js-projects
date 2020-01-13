const { Engine, Render, Runner, World, Body, Bodies, Events } = Matter;

const CELLS_HORIZONTAL = 10;
const CELLS_VERTICAL = 8;
const BORDER_THICKNESS = 4;
const WIDTH = window.innerWidth - BORDER_THICKNESS;
const HEIGHT = window.innerHeight - BORDER_THICKNESS;
const UNIT_LENGTH_X = WIDTH / CELLS_HORIZONTAL;
const UNIT_LENGTH_Y = HEIGHT / CELLS_VERTICAL;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
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

const grid = Array(CELLS_VERTICAL)
  .fill(null)
  .map(() => Array(CELLS_HORIZONTAL).fill(false));

const verticals = Array(CELLS_VERTICAL)
  .fill(null)
  .map(() => Array(CELLS_VERTICAL - 1).fill(false));

const horizontals = Array(CELLS_HORIZONTAL - 1)
  .fill(null)
  .map(() => Array(CELLS_HORIZONTAL).fill(false));

const startRow = Math.floor(Math.random() * CELLS_VERTICAL);
const startColumn = Math.floor(Math.random() * CELLS_HORIZONTAL);

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
    if (
      nextRow < 0 ||
      nextRow >= CELLS_VERTICAL ||
      nextColumn < 0 ||
      nextColumn >= CELLS_HORIZONTAL
    ) {
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
      columnIndex * UNIT_LENGTH_X + UNIT_LENGTH_X / 2,
      rowIndex * UNIT_LENGTH_Y + UNIT_LENGTH_Y,
      UNIT_LENGTH_X,
      5,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: '#f6e336'
        }
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
      columnIndex * UNIT_LENGTH_X + UNIT_LENGTH_X,
      rowIndex * UNIT_LENGTH_Y + UNIT_LENGTH_Y / 2,
      5,
      UNIT_LENGTH_Y,
      {
        label: 'wall',
        isStatic: true,
        render: {
          fillStyle: '#f6e336'
        }
      }
    );
    World.add(world, wall);
  });
});

// Goal
const goal = Bodies.rectangle(
  WIDTH - UNIT_LENGTH_X / 2,
  HEIGHT - UNIT_LENGTH_Y / 2,
  UNIT_LENGTH_X * 0.7,
  UNIT_LENGTH_Y * 0.7,
  {
    label: 'goal',
    isStatic: true,
    render: {
      fillStyle: '#45a749'
    }
  }
);
World.add(world, goal);

// Ball
const ballRadius = Math.min(UNIT_LENGTH_X, UNIT_LENGTH_Y) / 4;
const ball = Bodies.circle(UNIT_LENGTH_X / 2, UNIT_LENGTH_Y / 2, ballRadius, {
  label: 'ball',
  render: {
    fillStyle: '#03a2ec'
  }
});
World.add(world, ball);

document.addEventListener('keydown', event => {
  const { x, y } = ball.velocity;

  // Move ball up
  if (event.which === 87 || event.which === 38) {
    Body.setVelocity(ball, { x, y: y - 5 });
  }
  // Move ball left
  if (event.which === 65 || event.which === 37) {
    Body.setVelocity(ball, { x: x - 5, y });
  }
  // Move ball right
  if (event.which === 68 || event.which === 39) {
    Body.setVelocity(ball, { x: x + 5, y });
  }
  // Move ball down
  if (event.which === 83 || event.which === 40) {
    Body.setVelocity(ball, { x, y: y + 5 });
  }
});

// Win condition
Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['ball', 'goal'];

    if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'wall') {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
