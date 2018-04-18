function open_new_note_overlay() {
    console.log(document.getElementById("note_submit_overlay"));
    document.getElementById("note_submit_overlay").style.display = "block";
}

function exit_note_submit() {
    document.getElementById("sticky_submit_text").innerText = '';
    document.getElementById("note_submit_overlay").style.display = "none";
}

function create_postit() {
    var text = document.getElementById("sticky_submit_text").innerText;
    exit_note_submit();

    var postitsdiv = document.getElementById('postits');
    var postitsparent = document.getElementById('posits_parent')
    console.log(document.getElementById('postits').offsetHeight);
    console.log(document.getElementById('postits_parent').offsetWidth);
    var sticky = document.createElement("DIV");
    sticky.className = "sticky";
    var p = document.createElement("P");
    p.appendChild(document.createTextNode(text));
    sticky_text = document.createElement("DIV");
    sticky_text.className = "sticky_text";
    sticky_text.appendChild(p);
    sticky.appendChild(sticky_text);
    var ran_height = Math.floor(Math.random()*(postits_parent.offsetHeight-250)) + 1 + 50 ;
    var ran_width = Math.floor(Math.random()*(postitsdiv.offsetWidth-250)) + 1;
    console.log(ran_height, ran_height+'px');
    console.log(ran_width, ran_width+'px');
    sticky.style.top = ran_height+'px';
    sticky.style.left = ran_width+'px';
    postitsdiv.appendChild(sticky);
}


