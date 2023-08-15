var hamburger = document.getElementById("hamburger");

var cross = document.getElementById("cross");

var options = document.getElementById("options");

// var navbar = document.getElementById("NavBar");

hamburger.addEventListener("click" , ()=>{
    hamburger.classList.toggle("hidden");
    cross.classList.toggle("hiddencross");
    options.classList.toggle("hidden");
});


cross.addEventListener("click" , ()=>{
    hamburger.classList.toggle("hidden");
    cross.classList.toggle("hiddencross");
    options.classList.toggle("hidden");
});