import { virtual_space } from '../../space/virtual_space.js'
import { virtual_space_individual } from '../../space/virtual_space_individual.js'
import { real_space } from '../../space/real_space.js'
import {setupMenu} from "./setupMenu.js"


class App {
    constructor() {      
        this.setupWebpage();
        this.setupMenu = new setupMenu();
        
        this.virtual_space_individual = new virtual_space_individual();
        this.virtual_space = new virtual_space(this.virtual_space_individual);
        
        window.onresize = this.resize.bind(this);
    }

    resize(){
        this.virtual_space.resize();
        this.virtual_space_individual.resize();
    }

    /*==================== Webpage ====================*/

    setupWebpage() {
        this.text = document.querySelectorAll(".text");

        this.virtual_space_container = document.querySelector("#virtual_space_container");


    }


}

window.onload = function() {
    new App();
}