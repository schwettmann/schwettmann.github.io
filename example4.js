var Example = Example || {};

// Matter.use(
//     'matter-wrap'
// );

Example.avalanche = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composite = Matter.Composite,
        Composites = Matter.Composites,
        Common = Matter.Common,
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
            showAngleIndicator: true
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // add bodies
      render.options.wireframes = false
    var stack = Composites.stack(250, 1, 1, 1, 0, 0, function(x, y) {
    //var stack = Composites.stack(20, 20, 20, 5, 0, 0, function(x, y) {
        var poly = Bodies.polygon(x, y, 4, 50);             // <-- NUMBER OF SIDES, SIZE
        poly.friction = 0.001;                                  // <-- FRICTION in [0,1]
        Matter.Body.setMass(poly, 2);                       // <-- MASS
        poly.render.fillStyle = 'blue';

        return poly;
        //return Bodies.circle(x, y, Common.random(10, 20), { friction: 0.00001, restitution: 0.5, density: 0.001 });
    });
    
    World.add(world, stack);

    World.add(world, [
        Bodies.rectangle(50, 210, 400, 20, { isStatic: true, angle: Math.PI * 0 }),
        
        Bodies.rectangle(425, 600, 750, 20, { isStatic: true, angle: Math.PI * 0 }),
        Bodies.rectangle(55, 600, 550, 20, { isStatic: true, angle: Math.PI * 0.5 }),
        Bodies.rectangle(800, 600, 550, 20, { isStatic: true, angle: Math.PI * 0.5 }),
        
        // Bodies.rectangle(200, 150, 700, 20, { isStatic: true, angle: Math.PI * 0.06 }),
        // Bodies.rectangle(500, 350, 700, 20, { isStatic: true, angle: -Math.PI * 0.06 }),
        // Bodies.rectangle(340, 580, 700, 20, { isStatic: true, angle: Math.PI * 0.04 })
    ]);

    var catapult = Bodies.rectangle(100, 150, 520, 20);

    World.add(world, [
        catapult,
        Constraint.create({ bodyA: catapult, pointB: { x: 90, y: 200 } }),
        Constraint.create({ bodyA: catapult, pointB: { x: 110, y: 200 } })
        //Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
        // Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true }),
        //Bodies.rectangle(250, 555, 20, 50, { isStatic: true }),
        //Bodies.circle(560, 50, 50, { density: 0.005 }),
        // Bodies.rectangle(560, 100, 50, { density: 0.005 }),
        //Bodies.polygon(x, y, 3, 50);             // <-- NUMBER OF SIDES, SIZE

    ]);

 // order of things: (xcord, ycord, columns, rows, xgap, ygap) coord = top left corner coordinate
 // to add more particulates: move the whole thing up and add more rows. 

    var particulateSea = Composites.stack(68, 400, 47, 12, 1, 1, function(x, y) {
        var sea = Bodies.polygon(x, y, Math.round(Common.random(5, 8)), 8);
        // var sea = Bodies.polygon(x, y, 5, 8);
        sea.friction = 0.1;
        return sea;

        // return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
    });

    World.add(world, particulateSea);





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
    Render.lookAt(render, Composite.allBodies(world));

    // wrapping using matter-wrap plugin
    for (var i = 0; i < stack.bodies.length; i += 1) {
        stack.bodies[i].plugin.wrap = {
            min: { x: render.bounds.min.x, y: render.bounds.min.y },
            max: { x: render.bounds.max.x, y: render.bounds.max.y }
        };
    }

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