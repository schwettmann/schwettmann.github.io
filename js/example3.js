var Example = Example || {};

Example.catapult = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: Math.min(document.documentElement.clientWidth, 800),
            height: Math.min(document.documentElement.clientHeight, 600),
            showAngleIndicator: true,
            showCollisions: true,
            showVelocity: true
        }
    });

    Render.run(render);
   render.options.wireframes = false
    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
    var stack = Composites.stack(250, 420, 3, 3, 0, 0, function(x, y) {
       // var stack = Composites.stack(250, 400, 3, 3, 0, 0, function(x, y) {
        return Bodies.rectangle(x, y, 30, 30);
    });

    var stack = Composites.stack(400, 40, 1, 1, 0, 0, function(x, y) {
        // polygon is (x, y, number_of_sides, size)
        var poly = Bodies.polygon(x, y, 4, 50);             // <-- NUMBER OF SIDES, SIZE
        poly.friction = .002;                                  // <-- FRICTION in [0,1]
        Matter.Body.setMass(poly, 3);                       // <-- MASS
        poly.render.fillStyle = 'red';

        return poly;

        // return Bodies.polygon(x, y, 4, 50);
        // return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 40));
    });
    var catapult = Bodies.rectangle(400, 520, 520, 20);

    World.add(world, [
        stack,
        catapult,
        //Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
        Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
        //Bodies.rectangle(250, 555, 20, 50, { isStatic: true }),
        //Bodies.circle(560, 50, 50, { density: 0.005 }),
        // Bodies.rectangle(560, 100, 50, { density: 0.005 }),
        //Bodies.polygon(x, y, 3, 50);             // <-- NUMBER OF SIDES, SIZE

        Constraint.create({ bodyA: catapult, pointB: { x: 390, y: 580 } }),
        Constraint.create({ bodyA: catapult, pointB: { x: 410, y: 580 } })
    ]);



    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    World.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function() {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};