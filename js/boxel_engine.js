
// Constantes

// Material
// const IDEX_R = 0;
// const IDEX_G = 1;
// const IDEX_B = 2;
// const IDEX_TRANS = 3;
// const IDEX_REFL = 4;
// const IDEX_REFR = 5;

// Boxel
// const INDEX_X = 0;
// const INDEX_Y = 1;
// const INDEX_Z = 2;
// const INDEX_SX = 3;
// const INDEX_SY = 4;
// const INDEX_SZ = 5;
// const INDEX_MAT = 6;
// const INDEX_BX1 = 7;
// const INDEX_BX2 = 8;
// const INDEX_BX3 = 9;
// const INDEX_BX4 = 10;

// GPU functions

function fooGPU(boxels){
    let p = [1,1,1];
    return intersectionGPU(p, p, p, p);;
}

function getBoxelGPU(boxels, boxel_id, position){

    // function isInGPU(boxel_position, boxel_sizes, position){
    //     return false;
    //     position[0] >= boxel_position[0] & position[0] <= boxel_position[0] + boxel_sizes[0]
    //     & position[1] >= boxel_position[1] & position[1] <= boxel_position[1] + boxel_sizes[1]
    //     & position[2] >= boxel_position[2] & position[2] <= boxel_position[2] + boxel_sizes[2];
    // }

    let searching = true;

    while (searching) {
        searching = false;
        for (let k=0; k<4; k++){
            let inner_boxel_id = boxels[boxel_id][7 + k];
            if (inner_boxel_id >= 0){
                let inner_boxel_pos = [boxels[inner_boxel_id][0], boxels[inner_boxel_id][1], boxels[inner_boxel_id][2]];
                let inner_boxel_sizes = [boxels[inner_boxel_id][3], boxels[inner_boxel_id][4], boxels[inner_boxel_id][5]];
                //let is_in = position[0] >= inner_boxel_pos[0];// & position[0] <= inner_boxel_pos[0] + inner_boxel_sizes[0];
                // & position[1] >= inner_boxel_pos[1] & position[1] <= inner_boxel_pos[1] + inner_boxel_sizes[1]
                // & position[2] >= inner_boxel_pos[2] & position[2] <= inner_boxel_pos[2] + inner_boxel_sizes[2]);
                let bound1 = inner_boxel_pos[0] + inner_boxel_sizes[0]
                if (false){
                    boxel_id = inner_boxel_id;
                    searching = true;
                    break;
                }
            }
        }
    }

    return boxel_id;
}

function intersectionGPU(boxel_position, boxel_sizes, cast_point, direction){
    let t_minx = direction[0] == 0 ? -1. : (boxel_position[0] - cast_point[0]) / direction[0];
    let t_maxx = direction[0] == 0 ? -1. : (boxel_position[0] + boxel_sizes[0] - cast_point[0]) / direction[0];
    let t_miny = direction[1] == 0 ? -1. : (boxel_position[1] - cast_point[1]) / direction[1];
    let t_maxy = direction[1] == 0 ? -1. : (boxel_position[1] + boxel_sizes[1] - cast_point[1]) / direction[1];
    let t_minz = direction[2] == 0 ? -1. : (boxel_position[2] - cast_point[2]) / direction[2];
    let t_maxz = direction[2] == 0 ? -1. : (boxel_position[2] + boxel_sizes[2] - cast_point[2]) / direction[2];

    let face_min = 0;
    let face_max = 1;
    let t_min = t_minx;
    let t_max = t_maxx;

    if (t_maxx < t_minx) {
        t_min = t_maxx;
        t_max = t_minx;
        face_min = 1;
        face_max = 0;
    }

    if (t_miny < t_maxy){
        if (t_min < t_miny) {
            t_min = t_miny;
            face_min = 2;
        }
        if (t_max > t_maxy) {
            t_max = t_maxy;
            face_max = 3;
        }
    } else {
        if (t_min < t_maxy) {
            t_min = t_maxy;
            face_min = 3;
        }
        if (t_max > t_miny) {
            t_max = t_miny;
            face_max = 2;
        }
    }

    if (t_minz < t_maxz){
        if (t_min < t_minz) {
            t_min = t_minz;
            face_min = 4;
        }
        if (t_max > t_maxz) {
            t_max = t_maxz;
            face_max = 5;
        }
    } else {
        if (t_min < t_maxz) {
            t_min = t_maxz;
            face_min = 5;
        }
        if (t_max > t_minz) {
            t_max = t_minz;
            face_max = 4;
        }
    }

    if (t_min > t_max || t_max < 0.) {
        return [-1, -1]
    } else {
        if (t_min < 0.){
            return [t_max, face_max]
        } else {
            return [t_min, face_min]
        }
    }
    
}

// function intersectionFaceGPU(boxel_position, boxel_sizes, cast_point, direction){
//     let t_minx = direction[0] == 0 ? -1. : (boxel_position[0] - cast_point[0]) / direction[0];
//     let t_maxx = direction[0] == 0 ? -1. : (boxel_position[0] + boxel_sizes[0] - cast_point[0]) / direction[0];
//     let t_miny = direction[1] == 0 ? -1. : (boxel_position[1] - cast_point[1]) / direction[1];
//     let t_maxy = direction[1] == 0 ? -1. : (boxel_position[1] + boxel_sizes[1] - cast_point[1]) / direction[1];
//     let t_minz = direction[2] == 0 ? -1. : (boxel_position[2] - cast_point[2]) / direction[2];
//     let t_maxz = direction[2] == 0 ? -1. : (boxel_position[2] + boxel_sizes[2] - cast_point[2]) / direction[2];

//     let t = t_minx;
//     let face = 0;
//     if (t_maxx > t){
//         t = t_maxx;
//         face = 1;
//     }

//     if (t_miny < t_maxy) {
//         if (t_maxy < t) {
//             t = t_maxy;
//             face = 3;
//         }
//     } else {
//         if (t_miny < t) {
//             t = t_miny;
//             face = 2;
//         }   
//     }

//     if (t_minz < t_maxz) {
//         if (t_maxz < t) {
//             t = t_maxz;
//             face = 5;
//         }
//     } else {
//         if (t_minz < t) {
//             t = t_minz;
//             face = 4;
//         }   
//     }
//     return [t, face]
// }


function castRayGPU(boxels, materials, ray_boxel_id, cast_point, direction, channel){

    // for ray in rays{
    //     while (nb_steps < 10){
    //         if reflection {
    //             rays.addray(new ray)
    //         }

    //         color += new_color
    //     }
    // }

    // return color

    let color = 0.

    let iteration = 0;
    let next_ray = true;
    let ray_percentage = 1;
    let ray_cast_point = cast_point;
    let ray_direction = direction;
    
    while ( next_ray && iteration < 3){
        next_ray = false;
        let boxel_id = ray_boxel_id;

        if (boxel_id < 0){
            break;
        }

        let current_cast_point = ray_cast_point;
        let current_direction = ray_direction;
        let distance = 0.;
        let nb_steps = 0;
        let color_percentage = 0.;

        while (nb_steps < 10) {
        
            // On regarde dans quel boxel on est
            //boxel_id = getBoxelGPU(boxels, boxel_id, current_cast_point);
    
            //Calcul de t la distance entre le point de cast et le bord le plus proche du boxel
            let res = intersectionGPU(
                [boxels[boxel_id][0], boxels[boxel_id][1], boxels[boxel_id][2]],
                [boxels[boxel_id][3], boxels[boxel_id][4], boxels[boxel_id][5]],
                current_cast_point, current_direction);
            let t = res[0];
            let face = res[1];
            if (t < 0) {
                break;
            }
    
            let potential_next_boxel_id = -1;
    
            //On regarde si on intercepte un boxel contenu dans le boxel courant
            for (let k=0; k<4; k++){
                let inner_boxel_id = boxels[boxel_id][14 + k];
                if (inner_boxel_id >= 0){
                    let res = intersectionGPU(
                        [boxels[inner_boxel_id][0], boxels[inner_boxel_id][1], boxels[inner_boxel_id][2]],
                        [boxels[inner_boxel_id][3], boxels[inner_boxel_id][4], boxels[inner_boxel_id][5]],
                        current_cast_point, current_direction);
                    let t2 = res[0];
                    let face2 = res[1];
    
                    if (t2 > 0 && t2 < t){
                        t = t2;
                        face = face2;
                        potential_next_boxel_id = inner_boxel_id;
                    }
                }
            }
    
            t += 0.001;
    
            if (potential_next_boxel_id < 0){
                potential_next_boxel_id = boxels[boxel_id][13]; // set next boxel to parent boxel
                
            }

            //Point d'arrivée du ray

            let next_cast_point = [current_cast_point[0] + t * current_direction[0],
            current_cast_point[1] + t * current_direction[1],
            current_cast_point[2] + t * current_direction[2]];
            let next_direction = current_direction;
    
            //Pass through current boxel
            let material_id = boxels[boxel_id][12];

            
            let transparency = materials[material_id][3 + channel];

            let light = 0.;
            
            if (transparency <= 0.){
                let nearest_face = 0;
                let distance_to_nearest_face = Math.abs(current_cast_point[0]-boxels[boxel_id][0]);
                for (let potential_nearest_face=1; potential_nearest_face < 6; potential_nearest_face++){
                    let F = boxels[boxel_id][potential_nearest_face/2];
                    let add_size = potential_nearest_face%2;
                    if ( add_size == 1){
                        F += boxels[boxel_id][3 + potential_nearest_face/2]; //ajout de la size
                    }
                    let distance_to_face = Math.abs(current_cast_point[potential_nearest_face/2]-F);
                    if (distance_to_face < distance_to_nearest_face){
                        distance_to_nearest_face = distance_to_face;
                        nearest_face = potential_nearest_face;
                    }
                }
                light = boxels[boxel_id][6 + nearest_face];
            } else {
                for (let dir=0; dir< 6; dir++){
                    let index_direction = dir/2;
                    let F = boxels[boxel_id][index_direction];
                    let add_size = dir%2;
                    if ( add_size == 1){
                        F += boxels[boxel_id][3 + index_direction] //ajout de la size
                    }
                    let A = boxels[boxel_id][6 + dir];
    
                    let d = F - next_cast_point[index_direction];
                    let d0 = F - current_cast_point[index_direction];
                    let den = Math.log(transparency) * Math.abs(current_direction[index_direction]);
    
                    if (d < 0){
                        if (d0 < 0){
                            light += A * Math.abs((transparency**(-d) - 2) / (den) - (transparency**(-d0) - 2) / den);
                        } else {
                            light += A * Math.abs((transparency**(-d) - 2) / (den) - (transparency**(d0)) / (-den));
                        }
                    } else {
                        if (d0 < 0){
                            light += A * Math.abs(transparency**d / (-den) - (transparency**(-d0) - 2) / den);
                        } else {
                            light += A * Math.abs(transparency**d / (-den) - (transparency**(d0)) / (-den));
                        }
                    }
                }
            }

            let diaphragme = 0.2;
            let coef_diffusion = diaphragme * ray_percentage * (1. - color_percentage) * (1. - transparency**t) * light;
            color += materials[material_id][channel] * coef_diffusion;
            color_percentage += ray_percentage * (1. - color_percentage) * (1. - transparency**t);
            
    
            if (potential_next_boxel_id >=0){
                let next_material_id = boxels[potential_next_boxel_id][12];
                //Reflect on next boxel
                let coef_reflection = ray_percentage * (1. - color_percentage) * materials[next_material_id][6 + channel];            
                
                let direction_reflection = [-current_direction[0], current_direction[1], current_direction[2]];
                if (face == 2 || face == 3) {
                    direction_reflection = [current_direction[0], -current_direction[1], current_direction[2]];
                } else if (face == 4 || face == 5){
                    direction_reflection = [current_direction[0], current_direction[1], -current_direction[2]];
                }
    
                let t_reflection = t - 0.02;
                    
                let cast_point_reflection = [current_cast_point[0] + t_reflection * current_direction[0],
                                            current_cast_point[1] + t_reflection * current_direction[1],
                                            current_cast_point[2] + t_reflection * current_direction[2]];
    
                if (coef_reflection > 0.0) {
                    next_ray = true;
                    ray_percentage = coef_reflection;
                    ray_cast_point = cast_point_reflection;
                    ray_direction = direction_reflection;
                    color_percentage += coef_reflection;
                }
    
                // Refraction
                //n1sin(i) = n2sin(r)
                
                let n1 = materials[material_id][9 + channel];
                let n2 = materials[next_material_id][9 + channel];
                if (n2 != n1) {
                    let normale = [1., 0., 0.];
                    if (face == 2 || face == 3){
                        normale = [0., 1., 0.]
                    } else if (face == 4 || face == 5){
                        normale = [0., 0., 1.]
                    }
    
                    let cosi = current_direction[0] * normale[0] + current_direction[1] * normale[1] + current_direction[2] * normale[2];
                    if (cosi < 0.) {
                        cosi = -cosi;
                        normale = -normale;
                    }
                    let sini = Math.sqrt(1. - cosi * cosi);
                    let sinr = n1/n2 * sini;
                    let cosr = Math.sqrt(1. - sinr * sinr);
                    
                    let c = (cosr * cosr + sini * sini);
                    let normale90 = [c * current_direction[0] - cosr * normale[0],
                                    c * current_direction[1] - cosr * normale[1],
                                    c * current_direction[2] - cosr * normale[2]];
                    let norme_normale90 = Math.sqrt(normale90[0] * normale90[0] + normale90[1] * normale90[1] + normale90[2] * normale90[2])
                    normale90 = [normale90[0]/norme_normale90, normale90[1]/norme_normale90, normale90[2]/norme_normale90];
                    
                    let direction_refraction = [cosr * normale[0] + sinr * normale90[0],
                                                cosr * normale[1] + sinr * normale90[1],
                                                cosr * normale[2] + sinr * normale90[2]];
                    next_direction = direction_refraction;
                    
                    // Reflection totale quand r > pi/2
                    if (n1 > n2 && sini >= n2/n1) {
                        next_direction = direction_reflection;
                        next_cast_point = cast_point_reflection;
                        potential_next_boxel_id = boxel_id;
                    }
                }
    
                // Check color percentage
    
                if (color_percentage >= ray_percentage){
                    break;
                }
    
                // Next step
                distance += t;
                current_cast_point = next_cast_point;
                current_direction = next_direction;
    
                boxel_id = potential_next_boxel_id;
                
                nb_steps += 1;
            } else {
                break;
            }
        }
    }
    
    return color;
}


function renderGPU(boxels, materials, width, height, fov, u, ux, uy, position, boxel_id){
    
    
    let dx = fov * (this.thread.x - width/2) ;
    let dy = fov * ((height - this.thread.y) - height/2);

    let direction = [u[0] - dx * ux[0] - dy * uy[0],
                    u[1] - dx * ux[1] - dy * uy[1],
                    u[2] - dx * ux[2] - dy * uy[2]];
    let n = Math.sqrt(direction[0]*direction[0] + direction[1]*direction[1] + direction[2]*direction[2]);
    direction = [direction[0]/n, direction[1]/n, direction[2]/n]

    let r = castRayGPU(boxels, materials, boxel_id, [position[0], position[1], position[2]], direction, 0);
    let g = castRayGPU(boxels, materials, boxel_id, [position[0], position[1], position[2]], direction, 1);
    let b = castRayGPU(boxels, materials, boxel_id, [position[0], position[1], position[2]], direction, 2);
    this.color(r, g, b, 1)
}


class Material{
    constructor(diffusion, transparency, reflection, refraction){
        this.diffusion = diffusion; // diffusion pour chaque couleur, entre 0 (transparent) et 1 (opaque)
        this.transparency = transparency;
        this.reflection = reflection; // entre 0 et 1
        this.refraction = refraction; //n1*sin(i) = n2*sin(r)

    }

    toArray(){
        let result = [this.diffusion[0], this.diffusion[1], this.diffusion[2],
        this.transparency[0], this.transparency[1], this.transparency[2],
        this.reflection[0], this.reflection[1], this.reflection[2],
        this.refraction[0], this.refraction[1], this.refraction[2]]

        return result //[r, g, b, transparency, reflection, refraction]
    }
}

class Boxel{
    constructor(position, sizes, lighting, material_id, parent_boxel, inner_boxels){
        this.position = position;
        this.sizes = sizes;
        this.lighting = lighting; // each face has an amount of light, we store only the flux i.e amount of light / surface
        this.material_id = material_id; // id of material
        this.parent_boxel = parent_boxel;
        this.inner_boxels = inner_boxels; // ids of inner boxels
    }

    toArray(){
        let result = [this.position[0], this.position[1], this.position[2],
                    this.sizes[0], this.sizes[1], this.sizes[2],
                    this.lighting[0], this.lighting[1], this.lighting[2], this.lighting[3], this.lighting[4], this.lighting[5],
                    this.material_id,
                    this.parent_boxel,
                    this.inner_boxels[0], this.inner_boxels[1], this.inner_boxels[2],this.inner_boxels[3]]

        return result //[posx, posy, posz, sizex, sizey, sizez, lightnings, material_id, parent_boxel, boxelid1, boxelid2, boxelid3, boxelid4]
    }
}

class Camera{
    constructor(width, height){
        this.width = width;
        this.height = height;

        this.position = [0.0,0.0,0.0];
        this.teta = 0.0;
        this.phi = Math.PI/2.0;

        this.FOV = 0.001;
        this.render_distance = 1000.0;

        this.u = new Array(3);
        this.ux = new Array(3);
        this.uy = new Array(3);

        this.update();

        this.gpu = new GPU();
        this.gpu.addFunction(intersectionGPU);
        //this.gpu.addFunction(intersectionFaceGPU);
        //this.gpu.addFunction(isInGPU);
        this.gpu.addFunction(getBoxelGPU);
        this.gpu.addFunction(castRayGPU);
        this.render = this.gpu.createKernel(renderGPU)
        .setOutput([width, height])
        .setGraphical(true);

        this.fooGPU = this.gpu.createKernel(fooGPU).setOutput([1]);   

        document.getElementsByTagName('body')[0].appendChild(this.render.canvas);
    }

    update(){        
        this.u[0] = Math.sin(this.phi) * Math.cos(this.teta);
        this.u[1] = Math.sin(this.phi) * Math.sin(this.teta);
        this.u[2] = Math.cos(this.phi);
        
        this.uy = [-Math.cos(this.phi) * Math.cos(this.teta),
            -Math.cos(this.phi) * Math.sin(this.teta),
            Math.sin(this.phi)];
        
        // ux produit vectoriel de u et uy
        
        this.ux = [this.u[1] * this.uy[2] - this.u[2] * this.uy[1],
            this.u[2] * this.uy[0] - this.u[0] * this.uy[2],
            this.u[0] * this.uy[1] - this.u[1] * this.uy[0]];
    }

    drawFrame(boxels, materials, world_boxel_id){
        this.render(boxels, materials,
            this.width, this.height, this.FOV,
            this.u, this.ux, this.uy,
            this.position, world_boxel_id);
    }
}

class Light{
    constructor(power, color, position, parent){
        this.power = power;
        this.color = color;
        this.position = position;
        this.parent = parent; // parent boxel: the light will have effect only of the childs of the parent boxels recursively
    }
}

class BoxelEngine{
    constructor(boxels, materials, camera, lights){
        this.boxels = boxels;
        this.materials = materials;
        this.camera = camera;
        this.lights = lights;
    }
}
