(function () {

    // module aliases
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Events = Matter.Events;
    const Composites = Matter.Composites;
    const Composite = Matter.Composite;
    const Common = Matter.Common;
    const Constraint = Matter.Constraint;
    const Body = Matter.Body;
    const Bodies = Matter.Bodies;
    const MouseConstraint = Matter.MouseConstraint;

    // create an engine
    const engine = Engine.create();
    const world = engine.world;

    // create a renderer
    const render = Render.create({
        element: document.getElementById("canvas-container"),
        engine: engine,
        options: {
            showAxes: true,
            showDebug: true,
            showCollisions: true,
            showPositions: true,
            showConvexHulls: true,
            wireframes: false,
            background: '#111'
        }
    });

    var defaultCategory = 0x0001,
    redCategory = 0x0002,
    greenCategory = 0x0004,
    blueCategory = 0x0008;


    // add bodies
    var redColor = '#C44D58',
        greenColor = '#C7F464';

    //collider is the red box in the middle
    var collider = Bodies.rectangle(400, 300, 500, 50, {
        isSensor: true,
        isStatic: true,
        
        render: {
            strokeStyle: redColor,
            fillStyle: 'transparent',
            lineWidth: 1
        }
    });

    World.add(world, [
        
        Bodies.rectangle(400, 620, 800, 50, {
            isStatic: true,

            render: {
                fillStyle: 'transparent',
                lineWidth: 1
            }
        })
    ]);
    //add ball
    var torso = Bodies.circle(400, 40, 40, {
        collisionFilter: {
            category: redCategory
        }
    });
    var hand = Bodies.circle(450, 40, 10, {
        collisionFilter: {
            category: blueCategory
        }
    });

    var tether = Constraint.create({
        bodyA: torso,
        bodyB: hand
    });

    World.add(world, torso
    );
    World.add(world, hand
   );
    World.add(world, tether
   );

    //add wrecking ball
    var ball = Bodies.circle(500, 200, 50, { density: 0.04, frictionAir: 0.005 });

    World.add(world, ball);
    World.add(world, Constraint.create({
       bodyA: collider,
        bodyB: ball
    }));


    //add chain
    // add bodies
    var group = Body.nextGroup(true);

    var ropeA = Composites.stack(200, 100, 4, 2, 10, 10, function (x, y) {
        return Bodies.rectangle(x, y, 50, 20, { collisionFilter: { group: group } });
    });

    Composites.chain(ropeA, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2 });
    Composite.add(ropeA, Constraint.create({
        bodyB: ropeA.bodies[0],
        pointB: { x: -25, y: 0 },
        pointA: { x: 200, y: 100 },
        stiffness: 0.5
    }));

    World.add(world, ropeA);

    group = Body.nextGroup(true);

    var ropeB = Composites.stack(500, 100, 5, 2, 10, 10, function (x, y) {
        return Bodies.circle(x, y, 20, { collisionFilter: { group: group } });
    });

    Composites.chain(ropeB, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 2 });
    Composite.add(ropeB, Constraint.create({
        bodyB: ropeB.bodies[0],
        pointB: { x: -20, y: 0 },
        pointA: { x: 500, y: 100 },
        stiffness: 0.5
    }));

    World.add(world, ropeB);



 


    //event to make object no longer static while mouse is clicked
    //add static = false with click
    Events.on(engine, 'beforeUpdate', function () {
        if (mouseConstraint.mouse.button === -1 ) {
            mouseConstraint.body.category = blueCategory
        }
    });


            //event to make object static on collision


    Events.on(engine, 'collisionEnd', function (event) {
        var pairs = event.pairs;

        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];

            if (pair.bodyA === collider) {
                pair.bodyB.isStatic = true;
        } else if (pair.bodyB === collider) {
                pair.bodyB.isStatic = true;
        }
        }
        }),

    Events.on(engine, 'collisionStart', function (event) {
        var pairs = event.pairs;

        for (var i = 0, j = pairs.length; i != j; ++i) {
            var pair = pairs[i];

            if (pair.bodyA === collider) {
                pair.bodyB.isStatic = true;
        } else if (pair.bodyB === collider) {
                pair.bodyB.isStatic = true;
        }
        }
        });






    // run the engine
    Engine.run(engine);

    // run the renderer
    Render.run(render);

    // add a mouse controlled constraint
    const mouseConstraint = MouseConstraint.create(engine, {
        element: render.canvas
    });

    World.add(world, mouseConstraint);

    // pass mouse to renderer to enable showMousePosition
    render.mouse = mouseConstraint.mouse;
})();