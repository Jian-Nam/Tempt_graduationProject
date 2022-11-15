import { virtual_space } from '../../space/virtual_space.js'
import { virtual_space_individual } from '../../space/virtual_space_individual.js'
import { real_space } from '../../space/real_space.js'
import {setupMenu} from "./setupMenu.js"


class App {
    constructor() {      
        this.setupWebpage();
        this.real_space = new real_space();
        this.setupMenu = new setupMenu();
        window.onresize = this.resize.bind(this);
    }

    resize(){
        this.real_space.resize();
    }

    /*==================== Webpage ====================*/

    setupWebpage() {
        this.text = document.querySelectorAll(".text");
        this.real_space_container = document.querySelector("#real_space_container");

    }
}

window.onload = function() {
    new App();
}