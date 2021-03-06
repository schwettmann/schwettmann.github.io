var Example = Example || {};


Example.bridge = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
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
    var group = Body.nextGroup(true);

    // var bridge = Composites.stack(150, 300, 9, 1, 10, 10, function(x, y) {
    var bridge = Composites.stack(150, 300, 12, 1, 1, 10, function(x, y) {
        var bridge = Bodies.rectangle(x, y, 40, 20, { collisionFilter: { group: group } });
        bridge.friction = 1;
        return bridge;

        // return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
    });
    
  

    Composites.chain(bridge, 0.5, 0, -0.5, 0, { stiffness: 0.7 });
    
    //----  IMPORTANT STUFF HERE ----//
    render.options.wireframes = false
    // the stack is (bound_rect_width, bound_rect_height, rows, cols, ?, ?)
    var stack = Composites.stack(200, 40, 1, 1, 0, 0, function(x, y) {
        // polygon is (x, y, number_of_sides, size)
        var poly = Bodies.polygon(x, y, 6, 50);             // <-- NUMBER OF SIDES, SIZE
        poly.friction = 1;                                  // <-- FRICTION in [0,1]
        Matter.Body.setMass(poly, 5);                       // <-- MASS
        poly.render.fillStyle = 'blue';

        return poly;

        // return Bodies.polygon(x, y, 4, 50);
        // return Bodies.polygon(x, y, Math.round(Common.random(1, 8)), Common.random(20, 40));
    });

    World.add(world, [
        bridge,
        Bodies.rectangle(80, 440, 120, 280, { isStatic: true }),
        Bodies.rectangle(720, 440, 120, 280, { isStatic: true }),
        Constraint.create({ pointA: { x: 140, y: 300 }, bodyB: bridge.bodies[0], pointB: { x: -25, y: 0 } }),
        Constraint.create({ pointA: { x: 660, y: 300 }, bodyB: bridge.bodies[11], pointB: { x: 25, y: 0 } }),
        stack
    ]);

    Body.create({density: 2 })

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




// Example.mixed = function() {
//     var Engine = Matter.Engine,
//         Render = Matter.Render,
//         Runner = Matter.Runner,
//         Composites = Matter.Composites,
//         Common = Matter.Common,
//         MouseConstraint = Matter.MouseConstraint,
//         Mouse = Matter.Mouse,
//         World = Matter.World,
//         Bodies = Matter.Bodies;

//     // create engine
//     var engine = Engine.create(),
//         world = engine.world;

//     // create renderer
//     var render = Render.create({
//         element: document.body,
//         engine: engine,
//         options: {
//             width: Math.min(document.documentElement.clientWidth, 800),
//             height: Math.min(document.documentElement.clientHeight, 600),
//             showAngleIndicator: true
//         }
//     });

//     Render.run(render);

//     // create runner
//     var runner = Runner.create();
//     Runner.run(runner, engine);

//     // add bodies
//     var stack = Composites.stack(20, 20, 10, 5, 0, 0, function(x, y) {
//         var sides = Math.round(Common.random(1, 8));

//         // triangles can be a little unstable, so avoid until fixed
//         sides = (sides === 3) ? 4 : sides;

//         // round the edges of some bodies
//         var chamfer = null;
//         if (sides > 2 && Common.random() > 0.7) {
//             chamfer = {
//                 radius: 10
//             };
//         }

//         switch (Math.round(Common.random(0, 1))) {
//         case 0:
//             if (Common.random() < 0.8) {
//                 return Bodies.rectangle(x, y, Common.random(25, 50), Common.random(25, 50), { chamfer: chamfer });
//             } else {
//                 return Bodies.rectangle(x, y, Common.random(80, 120), Common.random(25, 30), { chamfer: chamfer });
//             }
//         case 1:
//             return Bodies.polygon(x, y, sides, Common.random(25, 50), { chamfer: chamfer });
//         }
//     });

//     World.add(world, stack);

//     World.add(world, [
//         // walls
//         Bodies.rectangle(400, 0, 800, 50, { isStatic: true }),
//         Bodies.rectangle(400, 600, 800, 50, { isStatic: true }),
//         Bodies.rectangle(800, 300, 50, 600, { isStatic: true }),
//         Bodies.rectangle(0, 300, 50, 600, { isStatic: true })
//     ]);

//     // add mouse control
//     var mouse = Mouse.create(render.canvas),
//         mouseConstraint = MouseConstraint.create(engine, {
//             mouse: mouse,
//             constraint: {
//                 stiffness: 0.2,
//                 render: {
//                     visible: false
//                 }
//             }
//         });

//     World.add(world, mouseConstraint);

//     // keep the mouse in sync with rendering
//     render.mouse = mouse;

//     // fit the render viewport to the scene
//     Render.lookAt(render, {
//         min: { x: 0, y: 0 },
//         max: { x: 800, y: 600 }
//     });

//     // context for MatterTools.Demo
//     return {
//         engine: engine,
//         runner: runner,
//         render: render,
//         canvas: render.canvas,
//         stop: function() {
//             Matter.Render.stop(render);
//             Matter.Runner.stop(runner);
//         }
//     };
// };