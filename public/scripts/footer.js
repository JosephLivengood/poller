/***THIS DIRECTORY ONLY FOR LIGHTLOAD CLIENT SCRIPTS***/

//To keep a universal footer across all pages.

var footer = document.createElement('ul');
footer.id = "footer";

for(var i=1;i<=4;i++) { //Temp 'links', until site structure is finalized.
    var navitem = document.createElement('li');
    var navlink = document.createElement('a');
    navlink.href = "page"+i+".html";
    navlink.appendChild(document.createTextNode("Menu Item "+i));
    navitem.appendChild(navlink);
}

document.body.appendChild(footer); //For now we'll just append.