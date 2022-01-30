
// Lights

let my_light = new Light(200, [1., 1., 1.], [30,30,30], 0);

let lights = [my_light]

// Materials
let air_material = new Material([1,1,1], // Diffusion, i.e color
                                [0.999,0.9993,0.9995], // Transparency percentage
                                [0, 0, 0], // Reflection percentage
                                [1, 1, 1]); // Refraction indice
let red_material = new Material([1.,0.0,0.],
                                [0.5, 0.5, 1.],
                                [0, 0, 0],
                                [1, 1, 1]);
let mirror_material = new Material([1.,1.0,1.],
                                [0,0,0],
                                [1.,1.0,1.0],
                                [1, 1, 1]);
let glass_material = new Material([1.,0.0,1.],
                                [0.5, 0.5, 0.5],
                                [0, 0, 0],
                                [1.1, 1.2, 1.3]);
let ground_material = new Material([1., 1., 1.],
                                [0.8, 0.8, 0.8],
                                [0, 0, 0],
                                [1, 1, 1]);

let materials = [air_material, red_material, mirror_material, glass_material, ground_material];

// Boxels
let world_boxel = new Boxel([0,0,0], // position
                            [1000,1000,1000], // sizes
                            air_material, // material
                            null, //parent boxel
                            [], // inner boxels
                            my_light); // Light
let red_cube = new Boxel([22,22,22], [1,2,3], red_material, world_boxel, [], null)
let mirror = new Boxel([25,22,22], [1,1,0.1], mirror_material, world_boxel, [],null)
let glass = new Boxel([23.5,23.5,22], [0.1,2,2], glass_material, world_boxel, [],null)
let cloud = new Boxel([10.,10.,15.], [20,20,3], ground_material, world_boxel, [],null)
let littlecube = new Boxel([20,20,16], [2,1,0.1], red_material, cloud, [],null)

world_boxel.inner_boxels.push(red_cube);
world_boxel.inner_boxels.push(mirror);
world_boxel.inner_boxels.push(glass);
world_boxel.inner_boxels.push(cloud);
cloud.inner_boxels.push(littlecube);

let boxels = [world_boxel, red_cube, mirror, glass, cloud, littlecube];

let width = 1000;
let height = 600;

let camera = new Camera(width, height, document.getElementById("view"));
camera.position = [20,20,30];

let boxel_engine = new BoxelEngine(camera, world_boxel);

// creator

let selected_light = my_light;
let selected_material = air_material;
let selected_boxel = world_boxel;

let add_light_btn = document.getElementById("add_light_btn");
let add_material_btn = document.getElementById("add_material_btn");
let add_boxel_btn = document.getElementById("add_boxel_btn");

let element_light_power = document.getElementById("light_power");
let element_light_color_red = document.getElementById("light_color_red");
let element_light_color_green = document.getElementById("light_color_green");
let element_light_color_blue = document.getElementById("light_color_blue");
let element_light_position_x = document.getElementById("light_position_x");
let element_light_position_y = document.getElementById("light_position_y");
let element_light_position_z = document.getElementById("light_position_z");

let element_material_diffusion_red = document.getElementById("material_diffusion_red");
let element_material_diffusion_green = document.getElementById("material_diffusion_green");
let element_material_diffusion_blue = document.getElementById("material_diffusion_blue");
let element_material_transparency_red = document.getElementById("material_transparency_red");
let element_material_transparency_green = document.getElementById("material_transparency_green");
let element_material_transparency_blue = document.getElementById("material_transparency_blue");
let element_material_reflection_red = document.getElementById("material_reflection_red");
let element_material_reflection_green = document.getElementById("material_reflection_green");
let element_material_reflection_blue = document.getElementById("material_reflection_blue");
let element_material_refraction_red = document.getElementById("material_refraction_red");
let element_material_refraction_green = document.getElementById("material_refraction_green");
let element_material_refraction_blue = document.getElementById("material_refraction_blue");

let element_boxel_position_x = document.getElementById("boxel_position_x");
let element_boxel_position_y = document.getElementById("boxel_position_y");
let element_boxel_position_z = document.getElementById("boxel_position_z");
let element_boxel_size_x = document.getElementById("boxel_size_x");
let element_boxel_size_y = document.getElementById("boxel_size_y");
let element_boxel_size_z = document.getElementById("boxel_size_z");
let element_boxel_material = document.getElementById("boxel_material");
let element_boxel_parent = document.getElementById("boxel_parent");
let element_boxel_light = document.getElementById("boxel_light");

function show_elements(){
    let element_lights = document.getElementById("lights");
    element_lights.innerHTML = "";

    for (let k=0; k<lights.length; k++){
        let element_light = document.createElement("p");
        element_light.innerText = "light "+k;
        element_light.addEventListener("click", (event)=>{
            if(event.button == 0){
                selected_light = lights[k];

                element_light_power.value = selected_light.power;
                element_light_color_red.value = selected_light.color[0];
                element_light_color_green.value = selected_light.color[1];
                element_light_color_blue.value = selected_light.color[2];
                element_light_position_x.value = selected_light.position[0];
                element_light_position_y.value = selected_light.position[1];
                element_light_position_z.value = selected_light.position[2];
            }
        });
        element_lights.appendChild(element_light);
    }

    let element_materials = document.getElementById("materials");
    element_materials.innerHTML = "";

    for (let k=0; k<materials.length; k++){
        let element_material = document.createElement("p");
        element_material.innerText = "material "+k;
        element_material.addEventListener("click", (event)=>{
            if(event.button == 0){
                selected_material = materials[k];

                element_material_diffusion_red.value = selected_material.diffusion[0];
                element_material_diffusion_green.value = selected_material.diffusion[1];
                element_material_diffusion_blue.value = selected_material.diffusion[2];
                element_material_transparency_red.value = selected_material.transparency[0];
                element_material_transparency_green.value = selected_material.transparency[1];
                element_material_transparency_blue.value = selected_material.transparency[2];
                element_material_reflection_red.value = selected_material.reflection[0];
                element_material_reflection_green.value = selected_material.reflection[1];
                element_material_reflection_blue.value = selected_material.reflection[2];
                element_material_refraction_red.value = selected_material.refraction[0];
                element_material_refraction_green.value = selected_material.refraction[1];
                element_material_refraction_blue.value = selected_material.refraction[2];
            }
        });
        element_materials.appendChild(element_material);
    }

    let elements_boxels = document.getElementById("boxels");
    elements_boxels.innerHTML = "";

    for (let k=0; k<boxels.length; k++){
        let element_boxel = document.createElement("p");
        element_boxel.innerText = "boxel "+k;
        element_boxel.addEventListener("click", (event)=>{
            if(event.button == 0){
                selected_boxel = boxels[k];

                element_boxel_position_x.value = selected_boxel.position[0];
                element_boxel_position_y.value = selected_boxel.position[1];
                element_boxel_position_z.value = selected_boxel.position[2];
                element_boxel_size_x.value = selected_boxel.sizes[0];
                element_boxel_size_y.value = selected_boxel.sizes[1];
                element_boxel_size_z.value = selected_boxel.sizes[2];
            }
        });
        elements_boxels.appendChild(element_boxel  );
    }
}

show_elements();

let apply_light_btn = document.getElementById("apply_light_btn");
apply_light_btn.addEventListener("click",(event)=>{
    if (event.button == 0){

        selected_light.power = parseFloat(element_light_power.value);
        selected_light.color[0] = parseFloat(element_light_color_red.value);
        selected_light.color[1] = parseFloat(element_light_color_green.value);
        selected_light.color[2] = parseFloat(element_light_color_blue.value);
        selected_light.position[0] = parseFloat(element_light_position_x.value);
        selected_light.position[1] = parseFloat(element_light_position_y.value);
        selected_light.position[2] = parseFloat(element_light_position_z.value);

        boxel_engine.process_lights(boxel_engine.world_boxel);
        boxel_engine.build_arrays();
    }
});

let apply_material_btn = document.getElementById("apply_material_btn");
apply_material_btn.addEventListener("click",(event)=>{
    if (event.button == 0){

        selected_material.diffusion[0] = parseFloat(element_material_diffusion_red.value);
        selected_material.diffusion[1] = parseFloat(element_material_diffusion_green.value);
        selected_material.diffusion[2] = parseFloat(element_material_diffusion_blue.value);
        selected_material.transparency[0] = parseFloat(element_material_transparency_red.value);
        selected_material.transparency[1] = parseFloat(element_material_transparency_green.value);
        selected_material.transparency[2] = parseFloat(element_material_transparency_blue.value);
        selected_material.reflection[0] = parseFloat(element_material_reflection_red.value);
        selected_material.reflection[1] = parseFloat(element_material_reflection_green.value);
        selected_material.reflection[2] = parseFloat(element_material_reflection_blue.value);
        selected_material.refraction[0] = parseFloat(element_material_refraction_red.value);
        selected_material.refraction[1] = parseFloat(element_material_refraction_green.value);
        selected_material.refraction[2] = parseFloat(element_material_refraction_blue.value);

        boxel_engine.process_lights(boxel_engine.world_boxel);
        boxel_engine.build_arrays();
    }
});

let apply_boxel_btn = document.getElementById("apply_boxel_btn");
apply_boxel_btn.addEventListener("click",(event)=>{
    if (event.button == 0){

        selected_boxel.position[0] = parseFloat(element_boxel_position_x.value);
        selected_boxel.position[1] = parseFloat(element_boxel_position_y.value);
        selected_boxel.position[2] = parseFloat(element_boxel_position_z.value);
        selected_boxel.sizes[0] = parseFloat(element_boxel_size_x.value);
        selected_boxel.sizes[1] = parseFloat(element_boxel_size_y.value);
        selected_boxel.sizes[2] = parseFloat(element_boxel_size_z.value);

        boxel_engine.process_lights(boxel_engine.world_boxel);
        boxel_engine.build_arrays();
    }
});

//events

let sensibilite = 0.001;

let mouse_down = false;
let mouse_x = 0;
let mouse_y = 0;
let mouse_click_x = 0;
let mouse_click_y = 0;
let teta_click = 0;
let phi_click = Math.PI/2

let change_mode = false;
let move_left = false;
let move_right = false;
let move_front = false;
let move_back = false;
let move_up = false;
let move_down = false;

window.addEventListener("keydown", function(event){
    if (event.code == "AltLeft"){
        change_mode = true;
    } else if(event.code == "KeyW"){
        move_front = true;
    } else if(event.code == "KeyS"){
        move_back = true;
    } else if(event.code == "KeyA"){
        move_left = true;
    } else if(event.code == "KeyD"){
        move_right = true;
    }  else if(event.code == "Space"){
        move_up = true;
    } else if(event.code == "ShiftLeft"){
        move_down = true;
    } else {
        console.log(event.code);
    }
});

window.addEventListener("keyup", function(event){
    if (event.code == "AltLeft"){
        change_mode = false;
    } else if(event.code == "KeyW"){
        move_front = false;
    } else if(event.code == "KeyS"){
        move_back = false;
    } else if(event.code == "KeyA"){
        move_left = false;
    } else if(event.code == "KeyD"){
        move_right = false;
    }  else if(event.code == "Space"){
        move_up = false;
    } else if(event.code == "ShiftLeft"){
        move_down = false;
    } else {
        console.log(event.code);
    }
});

window.addEventListener("mousedown", function(event){
    if (event.button == 0){
        mouse_down = true;
        mouse_click_x = event.x;
        mouse_click_y = event.y;
        teta_click = camera.teta;
        phi_click = camera.phi;
    } else {
        console.log(event.button);
    }
});

window.addEventListener("mouseup", function(event){
    if (event.button == 0){
        mouse_down = false
    } else {
        console.log(event.button);
    }
});

window.addEventListener("mousemove", function(event){
    mouse_x = event.x;
    mouse_y = event.y;
});

//run
let running = false;
let v = 2; //vitesse en m/ms
let previousTimeStamp=0;

function nextFrame(timestamp){
    if (!running){
        return
    }

    //time
    const dt = (timestamp - previousTimeStamp)/1000; // in secondes
    previousTimeStamp = timestamp;

    //fps
    let fps = document.getElementById("fps");
    fps.innerText = 1/dt + "fps";
    
    // Controls
    let new_position = camera.position;
    if (move_left){
        new_position = add(new_position, mul(v * dt,camera.ux));
    }
    if (move_right){
        new_position = substract(new_position, mul(v * dt,camera.ux));
    } 
    if (move_front){
        new_position = add(new_position, mul(v * dt,camera.u));
    }
    if (move_back){
        new_position = substract(new_position, mul(v * dt,camera.u));
    }
    if (move_up){
        new_position[2] += v * dt;
    }
    if (move_down){
        new_position[2] -= v * dt;
    }

    let teta = camera.teta;
    let phi = camera.phi;
    if (mouse_down){
        let dx = mouse_click_x - mouse_x;
        let dy = mouse_click_y - mouse_y;
        
        teta = teta_click - sensibilite * dx;
        phi = phi_click - sensibilite * dy;
    }

    //draw frame
    boxel_engine.set_camera_position(new_position);
    boxel_engine.set_camera_orientation(teta, phi);
    boxel_engine.render();

    window.requestAnimationFrame(nextFrame);
}

function run(){
    if (running){
        window.requestAnimationFrame(nextFrame);
    }
}

console.log("starting Boxel Engine...");
play_btn = document.getElementById("play_btn");
play_btn.addEventListener("mousedown",(event)=>{
    if (event.button == 0){
        running = !running;
        run();
    }
});