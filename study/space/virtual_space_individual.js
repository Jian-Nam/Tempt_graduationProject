import * as THREE from '../../build/three.module.js';
import { GLTFLoader } from "../../examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "../../examples/jsm/loaders/OBJLoader.js";
import { Area_table } from '../db/database.js';

export class virtual_space_individual{
    constructor(){
        this.container = document.querySelector("#discription_video_virtual");
        this.pixel_container = document.querySelector("#pixels");
        this.popularity_symbols = ["bike", "car", "truck"]

        const renderer = new THREE.WebGL1Renderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        const bgtexture = new THREE.TextureLoader().load( './study/src/textures/grid_b.png' );
        this.bgTexture = bgtexture;
        scene.background = bgtexture;
        this._scene = scene;


        this._setupCamera();
        this._setupLight();
        this._setupModel();
        //this._setupControls();

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
        camera.position.set(0, 15, 15);
        camera.lookAt(0, 5, 0);

        this._camera =  camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {



        // const gridHelper = new THREE.GridHelper( 10, 10 );
        // gridHelper.position.y = -1.5;
        // this._scene.add( gridHelper );
        this.building_objects = [];
        this.objects = [];

        // this.object.position.set(0, 0, 0);
        // this.object.rotation.x = 1.75;
        // console.log(this.object.rotation);
        // this._scene.add( this.object );
        // gltfLoader.load("./3d_objects/virtual.glb", (gltf)=>{
        //     const model = gltf.scene;
        //     this.architecture = model;
        //     this.architecture.traverse(child => {
        //         if(child instanceof THREE.Mesh && child.name == "area17"){
        //             console.log(child);
        //             this._scene.add(child);
        //             child.material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:false});

        //         }
        //     })
        // })

    }

    _setupControls() {
        new OrbitControls(this._camera, this.archieve_container);
    }

    reset_model(name){
        let objLoader = new OBJLoader();

        
        for(let i = 0; i< this.building_objects.length; i++){ 
            this._scene.remove( this.building_objects[i] )
        }

        for(let i = 0; i< this.objects.length; i++){ 
            this._scene.remove( this.objects[i] )
        }
        this.building_objects = [];
        this.objects = [];

        let url = Area_table[name].area

        objLoader.load(url, (obj) => {
            // obj.material = new THREE.MeshNormalMaterial();
            obj.children[0].scale.set(0.8, 0.8, 0.8)
            obj.children[0].material = new THREE.MeshBasicMaterial({color: 0x202020});
            // obj.children[0].material =new THREE.MeshNormalMaterial({transparent:true, opacity: 0.1});

            // const edges = new THREE.EdgesGeometry( obj.children[0].geometry );
            // const material = new THREE.LineBasicMaterial( { color: 0x00ff00, linewidth: 10} ) 
            // // const line = new THREE.LineSegments( edges, material );
            // line.scale.set(0.8, 0.8, 0.8)

            // this._scene.add(line);

            let obj2 = obj.clone();
            obj2.children[0].material = new THREE.MeshNormalMaterial({wireframe:true ,wireframeLineWidth:10});

            this._scene.add(obj);
            this._scene.add(obj2);
            this.building_objects.push(obj);
            this.building_objects.push(obj2);
        });

        //================================================//
        let object_names = Area_table[name].graffity


        for(let i = 0; i< object_names.length; i++){ 
            let directory = './study/src/digital_graffities/' + object_names[i]
            objLoader.load(directory, (obj)=>{
                // console.log(obj)
                // const edges = new THREE.EdgesGeometry( obj.children[0].geometry );
                // const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x00ff00 } ) );
                // line.position.z = 1;
                // this._scene.add( line );


                obj.children[0].scale.set(5, 5, 5)

                obj.children[0].position.z = 5;
                obj.children[0].position.y = i+6;
                //obj.children[0].rotation.y = 1.5;
                // obj.children[0].material = new THREE.MeshBasicMaterial({color:0x00ff00, wireframe:false});
                obj.children[0].material = new THREE.MeshNormalMaterial({transparent:true, opacity: 0.9});

                this._scene.add( obj );
                this.objects.push(obj);
            })
        }


        while ( this.pixel_container.hasChildNodes() )
        {
            this.pixel_container.removeChild( this.pixel_container.firstChild );       
        }

        for(let i = 0; i<Area_table[name].popularity; i++){
            var p = document.createElement("img");
            let symbol = this.popularity_symbols[i%3]
            p.src = "./study/src/pixels/" + symbol + ".png"
            p.classList.add(symbol);
            this.pixel_container.appendChild(p);
        }


    }

    // _setupPicking() {
    //     this.hoverable = 1;
    //     this.rayCaster = new THREE.Raycaster();
    //     this._renderer.domElement.addEventListener("mousemove", this.onMouseMove.bind(this), false);
    //     this._renderer.domElement.addEventListener("click", this.onMouseClick.bind(this), false);
    //     console.log(this.architecture.children[0].children)
    //     //this.raycasting_obj = this.architecture.children[0].children.slice(1,);
    // }

    // onMouseMove(e) {
    //     this.mouse = new THREE.Vector2();
    //     this.mouse.x = this.mouse.y = -1;
    //     this.mouse.x = (e.clientX/window.innerWidth)*2-1;
    //     this.mouse.y = -((e.clientY/window.innerHeight)*2-1);

    //     this.rayCaster.setFromCamera(this.mouse, this._camera);
    // }

    // onMouseClick(e) {

    //     if(this.hoverable == 0){
    //         this.hoverable = 1
    //         // this.toggle.style.color = "#00FF00"
    //         // this.title.style.color = "#00FF00"
    //     }else{
    //         let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

    //         if(intersects[0]){
    //             for(let i = 0; i < this.raycasting_obj.length; i++){
    //                 if(intersects[0].object == this.raycasting_obj[i]) {
    //                     this.hoverable = 0;
    //                     // this.toggle.style.color = "#000000"
    //                     // this.title.style.color = "#000000"
    //                     this.discription.style.left = "20%";
    //                     this.discription_video.style.left = "20%";
    //                 } 
    //             }
    //         }
    //     }
    // }

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
        // this._renderer.setClearColor( 0x000000, 1 );


        const canvasAspect = this.container.clientWidth / this.container.clientHeight;
        const imageAspect = this.bgTexture.image ? this.bgTexture.image.width / this.bgTexture.image.height : 1;
        const aspect = imageAspect / canvasAspect;
       
        this.bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
        this.bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
       
        this.bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
        this.bgTexture.repeat.y = aspect > 1 ? 1 : aspect;

        //auto rotation
        time *= 0.001; // second unit
        this._scene.rotation.y = time;
        //console.log(this.objects.length)
        for(let i = 0; i< this.objects.length; i++){
            this.objects[i].position.y = Math.sin(time*5)*0.5+i/2;

        }
        //mouse hover
        // if(this.architecture && this.rayCaster){
        //     for(let i = 0; i < this.raycasting_obj.length; i++){
        //         this.raycasting_obj[i].material.color.set(0x00FF00)
        //         this.raycasting_obj[i].position.z = 0;
        //     }
        //     let intersects = this.rayCaster.intersectObjects(this.raycasting_obj);

        //     if(this.hoverable){
        //         if(intersects[0]){
        //             intersects[0].object.material.color.set(0xFFFFFF)
        //             intersects[0].object.position.z = -1;
        //             for(let i = 0; i < this.raycasting_obj.length; i++){
        //                 if(intersects[0].object == this.raycasting_obj[i]) {
        //                     document.querySelector('#discription_title_virtual').innerHTML = intersects[0].object.name
        //                     this.discription.style.left = "80%";
        //                     this.discription_video.style.left = "80%";
        //                 }
        //             }
        //         }else {
        //             for(let i = 0; i < this.raycasting_obj.length; i++){
        //                 this.discription.style.left = "100%";
        //                 this.discription_video.style.left = "100%";
        //             }
        //         }
        //     }
        // }
    }
}

