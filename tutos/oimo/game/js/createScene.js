// The babylon engine
var engine;
// The current scene
var scene;
// The HTML canvas
var canvas;

// to go quicker
var v3 = BABYLON.Vector3;

// The function onload is loaded when the DOM has been loaded
document.addEventListener("DOMContentLoaded", function () {
    onload();
}, false);

// Resize the babylon engine when the window is resized
window.addEventListener("resize", function () {
	if (engine) {
		engine.resize();
	}
},false);

/**
 * Onload function : creates the babylon engine and the scene
 */
var onload = function () {
	// Engine creation
    canvas = document.getElementById("renderCanvas");
	engine = new BABYLON.Engine(canvas, true);

    // Scene creation
	createScene();

    // The render function
	engine.runRenderLoop(function () {
        scene.render();
	});	

};

var createScene = function() {

    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0,-10,0), new BABYLON.OimoJSPlugin());

    /** SKYBOX **/
    BABYLON.Engine.ShadersRepository = "shaders/";
    var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10, 2500, scene);
    var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
    shader.setFloat("offset", 0);
    shader.setFloat("exponent", 0.6);
    shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
    shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));
    shader.backFaceCulling = false;
    skybox.material = shader;


    /** CAMERA **/
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.86, 1.37, 250, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas);
    camera.maxZ = 5000;
    camera.lowerRadiusLimit = 120;
    camera.upperRadiusLimit = 430;
    camera.lowerBetaLimit =0.75;
    camera.upperBetaLimit =1.58 ;

    /** SUN LIGHT **/
    new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);

    /** GROUND **/
    var mat = new BABYLON.StandardMaterial("ground", scene);
    var t = new BABYLON.Texture("img/ground3.jpg", scene);
    t.uScale = t.vScale = 10;
    mat.diffuseTexture = t;
    mat.specularColor = BABYLON.Color3.Black();
    var g = BABYLON.Mesh.CreateBox("ground", 400, scene);
    g.position.y = -20;
    g.scaling.y = 0.01;
    g.material = mat;
    g.setPhysicsState({ impostor: BABYLON.PhysicsEngine.BoxImpostor, move:false});

    // Get a random number between two limits
    var randomNumber = function (min, max) {
        if (min == max) {
            return (min);
        }
        var random = Math.random();
        return ((random * (max - min)) + min);
    };

    // Initial height
    var y = 50;

    // all our objects
    var objects = [];

    // max number of objects
    var max = 150;

    // Creates arandom position above the ground
    var getPosition = function(y) {
        return new v3(randomNumber(-200,200), y, randomNumber(-200, 200));
    };

    // Creates
    for (var index = 0; index < max; index++) {

        // SPHERES
        var s = BABYLON.Mesh.CreateSphere("s", 30, randomNumber(20, 30), scene);
        s.position = getPosition(y);
        var matSphere = new BABYLON.StandardMaterial("boxmat", scene);
        matSphere.diffuseColor = BABYLON.Color3.FromInts(75, 71, 89);
        matSphere.specularColor = BABYLON.Color3.Black();
        s.material = matSphere;
        s.setPhysicsState({impostor:BABYLON.PhysicsEngine.SphereImpostor, move:true, mass:1, friction:0.5, restitution:0.5});

        // BOXES
        var d = BABYLON.Mesh.CreateBox("s", randomNumber(10, 20), scene);
        d.position = getPosition(y);
        var shaderBox = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
        shaderBox.setFloat("offset", 10);
        shaderBox.setFloat("exponent", 1.0);
        shaderBox.setColor3("topColor", BABYLON.Color3.FromInts(129,121,153));
        shaderBox.setColor3("bottomColor", BABYLON.Color3.FromInts(161,152, 191));
        d.material = shaderBox;

        d.rotation.x = randomNumber(-Math.PI/2, Math.PI/2);
        d.rotation.y = randomNumber(-Math.PI/2, Math.PI/2);
        d.rotation.z = randomNumber(-Math.PI/2, Math.PI/2);
        d.setPhysicsState({impostor:BABYLON.PhysicsEngine.BoxImpostor, move:true, mass:1, friction:0.5, restitution:0.1});


        // SAVE OBJECT
        objects.push(s, d);

        // INCREMENT HEIGHT
        y+=10;
    }

    scene.registerBeforeRender(function() {
        objects.forEach(function(obj) {
            // If object falls
            if (obj.position.y < -100) {
                obj.position = getPosition(200);
//                obj.updateBodyPosition();
            }
        });
    });

};
