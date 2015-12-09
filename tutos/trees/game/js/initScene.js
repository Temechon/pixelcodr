// The babylon engine
var engine;
// The current scene
var scene;
// The HTML canvas
var canvas;

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
	initScene();

    // The render function
	engine.runRenderLoop(function () {
        scene.render();
	});

};

var createSkybox = function() {
    // The box creation
    var skybox = BABYLON.Mesh.CreateSphere("skyBox", 100, 1000, scene);

    // The sky creation
    BABYLON.Engine.ShadersRepository = "shaders/";

    var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
    shader.setFloat("offset", 10);
    shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
    shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));

    shader.backFaceCulling = false;

    // box + sky = skybox !
    skybox.material = shader;
};

var initScene = function() {
    scene = new BABYLON.Scene(engine);

    // Update the scene background color
    scene.clearColor=new BABYLON.Color3(0.8,0.8,0.8);

    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogDensity = 0.003;
    scene.fogColor = new BABYLON.Color3(0.8,0.83,0.8);

    // Camera attached to the canvas
    var camera = new BABYLON.ArcRotateCamera("Camera", 0.67,1.2, 150, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas);

    // Hemispheric light to light the scene
    var h = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, -1), scene);
//    h.intensity = 0.35;

    var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
    d1.position = new BABYLON.Vector3(-300,300,600);
    var shadowGenerator = new BABYLON.ShadowGenerator(2048, d1);

    createSkybox();

    var ground = BABYLON.Mesh.CreateGround("ground", 1000, 1000, 1, scene);
    ground.material = new BABYLON.StandardMaterial("ground", scene);
    ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
    ground.material.specularColor = BABYLON.Color3.Black();

    ground.receiveShadows = true;


    var tg = new TreeGenerator(scene, shadowGenerator);
    initGui(tg);
};

var initGui = function(tg) {

    var gui = new dat.GUI();
    gui.add(tg, 'treeNumber', 1, 200).name("Number of trees").step(1).onChange(function(){
        tg.generate();
    });
    var f1 = gui.addFolder('Branch');
    f1.open();
    f1.add(tg, 'minSizeBranch', 1, 50).name("Min size").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'maxSizeBranch', 1, 50).name("Max size").step(0.5).onChange(function(){
        tg.generate();
    });

    f1 = gui.addFolder('Trunk');
    f1.open();
    f1.add(tg, 'minSizeTrunk', 1, 50).name("Min size").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'maxSizeTrunk', 1, 50).name("Max size").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'minRadius', 1, 10).name("Min radius").step(0.5).onChange(function(){
        tg.generate();
    });
    f1.add(tg, 'maxRadius', 1, 10).name("Max radius").step(0.5).onChange(function(){
        tg.generate();
    });

};
