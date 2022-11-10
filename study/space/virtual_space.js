import * as THREE from '../../build/three.module.js'
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js"
import { OBJLoader } from "../../examples/jsm/loaders/OBJLoader.js"
import { Area_table } from '../db/database.js';




export class virtual_space{
    constructor(virtual_space_individual){
        this.container = document.querySelector("#virtual_space_container");
        this.virtual_space_individual = virtual_space_individual
        this.discription = document.querySelector('#discription');
        this.discription_video = document.querySelector('#discription_video_virtual');

        this.area_number = document.querySelector('#area_number')
        this.owner = document.querySelector('#owner')
        this.area_size = document.querySelector('#Area_size');
        this.area_popularity = document.querySelector('#Popularity');
        this.area_price = document.querySelector('#Price');
        this.building_size = document.querySelector('#Building_size');

        const renderer = new THREE.WebGL1Renderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;



        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();

        this.resize();

        
        requestAnimationFrame(this.render.bind(this));
    }



    _setupCamera() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.001,
            100
        );
        //camera.position.z = 9;
        camera.position.set(0, 10, 0);
        this.camera_origin = camera.position.clone();
        this.camera_lookat = new THREE.Vector3(0, 0, 0);
        camera.lookAt(this.camera_lookat);

        this._camera =  camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;

        const light1 = new THREE.DirectionalLight(color, intensity);
        light1.position.set(-1, 3, 4);
        this._scene.add(light1);

        // const light2 = new THREE.DirectionalLight(color, 0.8);
        // light2.position.set(2, 3, 4);
        // this._scene.add(light2);

        const light3 = new THREE.DirectionalLight(color, 0.5);
        light3.position.set(0, 0, -7);
        this._scene.add(light3);
    }

    _setupModel() {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load("./study/src/digital_graffities/test.glb", (gltf)=> {
            const model = gltf.scene;

            model.traverse(child => {
                if(child instanceof THREE.Mesh){
                    child.position.set(0, 1, 2);
                    child.scale.set(20, 20, 20)
                    child.material = new THREE.MeshNormalMaterial({transparent:true, opacity:0.9});
                }

            })
            this._scene.add(model);
            // console.log(model);

            const animationClips = gltf.animations;
            const mixer = new THREE.AnimationMixer(model);
            const animationsMap = {};
            animationClips.forEach(clip => {
                const name = clip.name;
                // console.log(name);
                animationsMap[name] = mixer.clipAction(clip);
            });

            this._mixer = mixer;
            this._animationMap = animationsMap;
            this._currentAnimationAction = this._animationMap["Curve.005Action"];
            this._currentAnimationAction.play();
        })


        const size = 100;
        const divisions = 60;

        const gridHelper = new THREE.GridHelper( size, divisions );
        this._scene.add( gridHelper );

        const objLoader = new OBJLoader();

        objLoader.load("./study/src/maps/virtual.obj", (obj) => {
            this._scene.add(obj);
            this.architecture = obj;
            this.raycasting_obj = [];
            // console.log(this.architecture);

            this.architecture.traverse(child => {
                if(child instanceof THREE.Mesh){
                    // console.log(child.name);
                    // child.material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.7});
                    // child.material = new THREE.MeshStandardMaterial();
                    if(Area_table[child.name].owner == "NONE"){
                        child.material = new THREE.MeshNormalMaterial({transparent:true, opacity:0.7});
                        child.material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent:true, opacity:0.7});
                    }else{
                        child.material = new THREE.MeshBasicMaterial({color: 0xff00ff, transparent:true, opacity:0.7});
                    }
                    
                    // child.material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:true});
                    this.raycasting_obj.push(child);

                    const edges = new THREE.EdgesGeometry( child.geometry );
                    const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 100} ) );
                    this._scene.add( line );

                }
            })
            this._setupPicking();
            
        })

    }

    _setupControls() {
        // this.container.addEventListener("wheel", (event) => {this.move_camera(event);})
    }

    move_camera(event){
        event.preventDefault();
        const min = 3;
        const max = 15
        this._camera.position.z = Math.min(Math.max(this._camera.position.z+event.deltaY*0.002, min), max)
    }

    _setupPicking() {
        this.hoverable = 1;
        this.rayCaster = new THREE.Raycaster();
        this._renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this), false);
        this._renderer.domElement.addEventListener("click", this.onMouseClick.bind(this), false);
        //console.log(this.architecture.children[0].children)
        //this.raycasting_obj = this.architecture.children[0].children.slice(1,);
    }

    onMouseMove(e) {
        this.mouse = new THREE.Vector2();
        this.mouse.x = this.mouse.y = -1;
        this.mouse.x = (e.clientX/window.innerWidth)*2-1;
        this.mouse.y = -((e.clientY/window.innerHeight)*2-1);

        this.rayCaster.setFromCamera(this.mouse, this._camera);
    }

    onMouseClick(e) {

        if(this.hoverable == 0){
            this.hoverable = 1
            // this.toggle.style.color = "#00FF00"
            // this.title.style.color = "#00FF00"
        }else{
            let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

            if(intersects[0]){
                for(let i = 0; i < this.raycasting_obj.length; i++){
                    if(intersects[0].object == this.raycasting_obj[i]) {
                        this.hoverable = 0;
                        // this.toggle.style.color = "#000000"
                        // this.title.style.color = "#000000"
                        this.virtual_space_individual.reset_model(this.raycasting_obj[i].name);
                        this.discription.style.right = "0%";
                    } 
                }
            }
        }
    }

    resize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this._camera.aspect = width/height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        //this._renderer.setClearColor( 0x00ff00, 1 );
        //auto rotation
        time *= 0.001; // second unit
        // console.log(time);
        // this._scene.rotation.y = time*0.2;

        if(this._mixer) {
            const deltaTime = time - this._previousTime;
            this._mixer.update(deltaTime);
        }
        this._previousTime = time;

        //mouse hover
        if(this.architecture && this.rayCaster){

            let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

            if(this.hoverable){
                if(intersects[0]){
                    //// intersects[0].object.material.color.set(0xFFFFFF)
                    intersects[0].object.material.opacity = 0.9;
                    // console.log(intersects[0].object.position)


                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        if(intersects[0].object == this.raycasting_obj[i]) {
                            let name = intersects[0].object.name
                            let area_info = Area_table[name];

                            this.area_number.innerHTML = name;
                            this.owner.innerHTML = area_info.owner;
                            if(area_info.owner == "NONE"){
                                this.owner.style.color = "red"
                            }else{
                                this.owner.style.color = "aqua"
                            }
                            this.area_size.innerHTML = "Size : " + area_info.size;
                            this.area_popularity.innerHTML = "Popularity : " + area_info.popularity;
                            this.area_price.innerHTML = "Price : " + area_info.price;
                            this.building_size.innerHTML = "Building size : " +  area_info.building_size;

                            this.discription.style.right = "-96vh"
                            //this.raycasting_obj[i].position.z = -1;
                            this.raycasting_obj[i].position.y = this.raycasting_obj[i].position.y * 0.7 +0.15;

                            //================================================//
                            // console.log(intersects[0])
                            let p = intersects[0].point.clone();
                            // console.log(p)
                            let q = p.clone();
 

                            // this.camera_lookat.multiplyScalar(0.999);
                            // p.multiplyScalar(0.001);
                            // this.camera_lookat.add(p);
                            // this._camera.lookAt(this.camera_lookat)


                            this._camera.position.multiplyScalar(0.97);
                            q.y += 3;
                            q.multiplyScalar(0.03);
                            this._camera.position.add(q);
                            // console.log(this._camera.position)
                             //================================================//

                        }else{
                            this.raycasting_obj[i].position.y = this.raycasting_obj[i].position.y * 0.7;
                            //// this.raycasting_obj[i].material.color.set(0x00FF00)
                            this.raycasting_obj[i].material.opacity = 0.7;
                        }
                    }
                }else {
                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        this.discription.style.right = "-135vh";
                    }
                    for(let i = 0; i < this.raycasting_obj.length; i++){
                        //// this.raycasting_obj[i].material.color.set(0x00FF00)
                        this.raycasting_obj[i].material.opacity = 0.7;
                        this.raycasting_obj[i].position.y = this.raycasting_obj[i].position.y * 0.7;
                    }

                    //================================================//
                    this._camera.position.multiplyScalar(0.97);
                    this._camera.position.y += 0.30;
                    // this.camera_lookat.multiplyScalar(0.99);
                    // this._camera.lookAt(this.camera_lookat);
                    //================================================//
                }
            }
        }
    }
}

