/* Programming 9
 * CSCI 4611, Fall 2026, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'
import { GUI } from 'dat.gui'

export class App extends gfx.GfxApp
{
    private cameraControls: gfx.OrbitControls;

    // The base mesh that will be blended into the target meshes
    private baseMesh: gfx.Mesh3;

    // The target meshes to blend with the base mesh
    private targetMeshes: gfx.Mesh3[];

    // The morph mesh that will be blended between the base mesh and the target meshes
    // We set it to public so that morphAlpha can be controlled by the GUI
    public morphMesh: gfx.MorphMesh3;

    // The number of the selected target pose (1-9)
    // We set it to public so dat.gui can bind to the selected target pose.
    public targetPose: number;

    // --- Create the App class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);

        this.baseMesh = new gfx.Mesh3();
        this.targetMeshes = [];
        this.morphMesh = new gfx.MorphMesh3();
        this.targetPose = 1;
    }


    // --- Initialize the graphics scene ---
    createScene(): void 
    {
        // Setup the camera projection matrix and position.
        this.camera.setPerspectiveCamera(60, 1920/1080, 0.1, 10);

        // Set the background color to a sky blue
        this.renderer.background.set(0.43, 0.71, 0.73);

        // Set the viewport to crop the image to fit the window
        this.renderer.viewport = gfx.Viewport.CROP;

        // Set the camera position and orientation using orbit controls
        this.cameraControls.setDistance(1.5);
        this.cameraControls.setTargetPoint(new gfx.Vector3(0, 0.25, 0));

        // Create an ambient light
        const ambientLight = new gfx.AmbientLight(new gfx.Color(0.25, 0.25, 0.25));
        this.scene.add(ambientLight);

        // Create a directional light
        const directionalLight = new gfx.DirectionalLight(new gfx.Color(0.75, 0.75, 0.75));
        directionalLight.position.set(-2, 1, 1)
        this.scene.add(directionalLight);

        // Create the ground with the top surface at y=0
        const ground = gfx.Geometry3Factory.createBox(10, 1, 10);
        ground.material.setColor(new gfx.Color(0, 0.5, 0.5));
        ground.position.y = -0.5;
        this.scene.add(ground);

        // Load the base mesh from an OBJ file
        // The base mesh does not need to be added to the scene
        // The data will be copied into the morph mesh after everything is loaded
        this.baseMesh = gfx.MeshLoader.loadOBJ("cat-reference.obj");

        // Load the target meshes
        for(let i=1; i <= 9; i++)
        {
            const mesh = gfx.MeshLoader.loadOBJ("cat-0" + i + ".obj");
            this.targetMeshes.push(mesh);
        }

        // It's almost Halloween, so let's make the cat a little spooky by giving it a dark gray color
        this.morphMesh.material.setColor(new gfx.Color(0.25, 0.25, 0.25, 1));
    
        // Create a simple GUI
        const gui = new GUI();
        gui.width = 300;

        const targetPoseController = gui.add(
            this,
            'targetPose',
            [1, 2, 3, 4, 5, 6, 7, 8, 9]
        );
        targetPoseController.onChange(
            () => this.updateTargetPose()
        );

        const morphController = gui.add(
            this.morphMesh, 
            'morphAlpha',
            0, 1, 0.01);
        morphController.name('Alpha');
    }

    onAssetsLoaded(): void
    {
        // Copy the references to the base mesh buffers into the morph mesh 
        this.morphMesh.positionBuffer = this.baseMesh.positionBuffer;
        this.morphMesh.normalBuffer = this.baseMesh.normalBuffer;
        this.morphMesh.colorBuffer = this.baseMesh.colorBuffer;
        this.morphMesh.indexBuffer = this.baseMesh.indexBuffer;
        this.morphMesh.texCoordBuffer = this.baseMesh.texCoordBuffer;
        this.morphMesh.vertexCount = this.baseMesh.vertexCount;
        this.morphMesh.triangleCount = this.baseMesh.triangleCount;

        this.updateTargetPose();
        
        this.morphMesh.morphAlpha = 0;

        // Add the morph mesh to the scene
        this.scene.add(this.morphMesh);
    }
    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        // Update the camera controls
        this.cameraControls.update(deltaTime);
    }

    public updateTargetPose(): void
    {
        const targetMesh = this.targetMeshes[this.targetPose - 1];
        this.morphMesh.morphTargetPositionBuffer = targetMesh.positionBuffer;
        this.morphMesh.morphTargetNormalBuffer = targetMesh.normalBuffer;

    }
}
