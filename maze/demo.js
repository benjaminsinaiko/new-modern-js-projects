const { Engine, Render, Runner, World, Bodies, Mouse, MouseConstraint } = Matter;

const WIDTH = 800;
const HEIGHT = 600;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    WIDTH: 800,
    HEIGHT: 600,
    wireframes: false
  }
});
Render.run(render);
Runner.run(Runner.create(), engine);

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas)
  })
);

// Walls
const walls = [
  Bodies.rectangle(400, 0, 800, 40, {
    isStatic: true
  }),
  Bodies.rectangle(400, 600, 800, 40, {
    isStatic: true
  }),
  Bodies.rectangle(0, 300, 40, 600, {
    isStatic: true
  }),
  Bodies.rectangle(800, 300, 40, 600, {
    isStatic: true
  })
];
World.add(world, walls);

// Random Shapes
for (let i = 0; i < 35; i++) {
  if (Math.random() > 0.5) {
    World.add(world, Bodies.rectangle(Math.random() * WIDTH, Math.random() * HEIGHT, 50, 50));
  } else {
    World.add(world, Bodies.circle(Math.random() * WIDTH, Math.random() * HEIGHT, 35));
  }
}
