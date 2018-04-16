function create_postit() {
    var postitsdiv = document.getElementById('postits');
    console.log(document.getElementById('postits').offsetHeight);
    console.log(document.getElementById('postits').offsetWidth);
    var div = document.createElement("DIV");
    div.className = "sticky";
    var p = document.createElement("P");
    p.appendChild(document.createTextNode("thank u person"));
    div.appendChild(p);
    var ran_height = Math.floor(Math.random()*(postitsdiv.offsetHeight-250)) + 1 ;
    var ran_width = Math.floor(Math.random()*(postitsdiv.offsetWidth-250)) + 1;
    console.log(ran_height, ran_height+'px');
    console.log(ran_width, ran_width+'px');
    div.style.top = ran_height+'px';
    div.style.left = ran_width+'px';
    postitsdiv.appendChild(div);


}