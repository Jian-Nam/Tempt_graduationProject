import * as THREE from '../../../build/three.module.js';
import { GLTFLoader } from "../../../examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "../../../examples/jsm/loaders/OBJLoader.js";
import { Area_table } from '../../db/database.js';
import {setupMenu} from "./setupMenu.js"

class App{
    constructor(){
        this.setup_menu = new setupMenu();

        this.area_list = document.querySelector("#area_list");
        this.area_list_container = document.querySelector("#area_list_container");

        this.area_list_container.addEventListener("mouseover", () => {
            this.area_list_container.style.right = "4vh"
        })
        this.area_list_container.addEventListener("mouseout", () => {
            this.area_list_container.style.right = "-32vh"
        })

        this.virtual_map_2d = document.querySelector("#virtual_map_2d");

        console.log(this.area_list)

        this.listElements = [];
        for(let area_id in Area_table){
            console.log(area_id)
            let li_elem = document.createElement("li");
            let area_id_elem = document.createElement("div");
            let area_info_elem = document.createElement("div");
            let area_size_elem = document.createElement("div");
            let area_subtext_elem = document.createElement("div");
            let area_owner_elem = document.createElement("div");
            
            li_elem.setAttribute("id", area_id);

            area_id_elem.classList.add("area_id");
            area_info_elem.classList.add("area_info");
            area_size_elem.classList.add("area_size");
            area_subtext_elem.classList.add("list_element_subtext");
            area_owner_elem.classList.add("area_owner");

            area_id_elem.innerHTML = area_id;
            area_size_elem.innerHTML = "Area_size : " + Area_table[area_id].size;
            area_subtext_elem.innerHTML = "Occupied by";
            area_owner_elem.innerHTML = Area_table[area_id].owner;


            area_info_elem.append(area_size_elem, area_subtext_elem, area_owner_elem)
            li_elem.append(area_id_elem, area_info_elem);

            this.area_list.appendChild(li_elem);
            this.listElements.push(li_elem);

            let img_elem = document.createElement("img");
            img_elem.setAttribute("id", area_id + "_2d_map")
            img_elem.src  = "./study/src/maps/2d_map/" + area_id + ".svg"
            this.virtual_map_2d.appendChild(img_elem);
        }

        this.Area_id = document.querySelector("#Area_id");
        this.Area_size = document.querySelector("#Area_size");
        this.Area_owner = document.querySelector("#Area_owner");

        this.add_listPageEvent();


        this.container = document.querySelector("#canvus_container");

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

        requestAnimationFrame(this.render.bind(this));

        window.onresize = this.resize.bind(this);
        this.resize();
    }

    add_listPageEvent(){

        for(let value of this.listElements){
            console.log(value.firstElementChild.style)
            value.addEventListener("mouseover", ()=>{
                value.children[0].style.opacity = 1;
                value.children[1].style.opacity = 1;
                value.style.paddingTop = "2vh";
                value.style.paddingBottom = "2vh";
                value.style.background = "#101010";
                this.virtual_map_2d.style.opacity = 0.9;
                // console.log(document.querySelector("#" + value.id + "_2d_map"))
                document.querySelector("#" + value.id + "_2d_map").style.filter = "invert(54%) sepia(55%) saturate(3823%) hue-rotate(85deg) brightness(129%) contrast(114%)"
            });
            value.addEventListener("mouseout", ()=>{
                value.children[0].style.opacity = 0.3;
                value.children[1].style.opacity = 0.1;
                value.style.paddingTop = "1vh";
                value.style.paddingBottom = "1vh";
                value.style.background = "#000000";
                this.virtual_map_2d.style.opacity = 0.1;
                document.querySelector("#" + value.id + "_2d_map").style.filter = "invert(100%) sepia(100%) saturate(0%) hue-rotate(292deg) brightness(108%) contrast(108%)"
            });
            value.addEventListener("click", (event)=>{this.show_palce(event.currentTarget.id)});
        }
    }

    show_palce(current_id){
        this.Area_id.innerHTML = current_id;
        this.Area_size.innerHTML = "Area_size : " + Area_table[current_id].size;
        this.Area_owner.innerHTML = Area_table[current_id].owner;
        this.reset_model(current_id);
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
        camera.position.set(0, 20,16);
        camera.lookAt(0, 7, 0);

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
        const objLoader = new OBJLoader

        this.objects = [];
        this.show_palce("X1")
    }

    _setupControls() {
        new OrbitControls(this._camera, this.archieve_container);
    }

    reset_model(name){
        console.log(name)
        const objLoader = new OBJLoader();


        for(let i = 0; i< this.objects.length; i++){ 
            this._scene.remove( this.objects[i] )
        }

        this.objects = [];
        let url = Area_table[name].area

        objLoader.load(url, (obj)=>{
            obj.children[0].material = new THREE.MeshNormalMaterial();
            this._scene.add( obj );
            this.objects.push(obj);
        });
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
        this._renderer.setClearColor( 0x000000, 0 );
        //auto rotation
        time *= 0.001; // second unit

        const canvasAspect = this.container.clientWidth / this.container.clientHeight;
        const imageAspect = this.bgTexture.image ? this.bgTexture.image.width / this.bgTexture.image.height : 1;
        const aspect = imageAspect / canvasAspect;
       
        this.bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
        this.bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
       
        this.bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
        this.bgTexture.repeat.y = aspect > 1 ? 1 : aspect;


        if(this.building){
            this.building.rotation.y = time;
        }

        //console.log(this.objects.length)
        for(let i = 0; i< this.objects.length; i++){
            this.objects[i].rotation.y = time;
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

window.onload = function() {
    new App();
}

