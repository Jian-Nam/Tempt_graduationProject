import { virtual_space } from '../../space/virtual_space.js'
import { virtual_space_individual } from '../../space/virtual_space_individual.js'
import { real_space } from '../../space/real_space.js'


class App {
    constructor() {      
        this.setupWebpage();
        
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

        this.title = document.querySelector("#title");
        this.toggle = document.querySelector("#toggle");
        this.archive_list = document.querySelector("#archive_list");
        this.place_shop = document.querySelector("#place_shop");
        this.graffity_shop = document.querySelector("#graffity_shop");
        this.project =  document.querySelector("#project");
        this.contact =  document.querySelector("#contact");

        this.menu_elements = document.querySelectorAll("li");

        for(let i = 0; i<this.menu_elements.length; i++){
            this.menu_elements[i].addEventListener("mouseover", (event) => {
                this.menu_elements[i].style.color = "aqua";
                this.menu_elements[i].style.width = "8vh";
                this.menu_elements[i].style.lineHeight = "8vh";
                this.menu_elements[i].style.background = "#101010"
            });
            this.menu_elements[i].addEventListener("mouseout", (event) => {
                this.menu_elements[i].style.color = "white";
                this.menu_elements[i].style.width = "4vh";
                this.menu_elements[i].style.lineHeight = "4vh";
                this.menu_elements[i].style.background = "#000000"
            });
        }


        this.toggle.addEventListener("click", this.change_mode.bind(this));
        this.place_shop.addEventListener("click", this.go_placeShop.bind(this));
        this.archive_list.addEventListener("click", this.go_archiveList.bind(this));
        this.graffity_shop.addEventListener("click", this.go_graffityShop.bind(this));
        this.project.addEventListener("click", this.go_project.bind(this));
        this.contact.addEventListener("click", this.go_contact.bind(this));

    }

    change_mode() {
        location.href = "archive_space.html"
    }

    go_archiveList(){
        location.href = "archive_list.html"
    }

    go_placeShop() {
        location.href = "place_shop.html";
    }

    go_graffityShop(){
        location.href = "graffity_shop.html";
    }

    go_contact(){
        location.href = "contact.html";
    }

    go_project(){
        location.href = "project.html";
    }
}

window.onload = function() {
    new App();
}