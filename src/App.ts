/* Programming 9
 * CSCI 4611, Fall 2026, University of Minnesota
 * Instructor: Evan Suma Rosenberg <suma@umn.edu>
 * License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 */ 

import * as gfx from 'gophergfx'

export class App extends gfx.GfxApp
{
    private cameraControls: gfx.OrbitControls;

    // --- Create the App class ---
    constructor()
    {
        // initialize the base class gfx.GfxApp
        super();

        this.cameraControls = new gfx.OrbitControls(this.camera);
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
    }
    
    // --- Update is called once each frame by the main graphics loop ---
    update(deltaTime: number): void 
    {
        // Update the camera controls
        this.cameraControls.update(deltaTime);
    }
}
