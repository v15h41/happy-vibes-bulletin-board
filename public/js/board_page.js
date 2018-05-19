


function open_new_note_overlay() {
    document.getElementById("note_submit_overlay").style.display = "block";
}

function open_new_event_overlay() {
    document.getElementById("event_submit_overlay").style.display = "block";
}

function exit_event_submit() {
    document.getElementById("event_submit_overlay").style.display = "none";
}

function exit_note_submit() {
    document.getElementById("sticky_submit_text").innerText = '';
    document.getElementById("note_submit_overlay").style.display = "none";
}

function exit_join_workspace() {
    document.getElementById("join_submit_overlay").style.display = "none";
}

function open_join_workspace_overlay() {
    document.getElementById("join_workspace_overlay").style.display = "block";
}

function join_workspace() {

    var workspace_name = document.getElementById("sticky_join_workspace_text").innerText;

    // get workspace id
    var XHR_get_workspace_id = new XMLHttpRequest();
    XHR_get_workspace_id.open('GET', '/get_workspace_id/' + workspace_name);
    XHR_get_workspace_id.send();
    XHR_get_workspace_id.onreadystatechange = function () {
        if (XHR_get_workspace_id.readyState == XMLHttpRequest.DONE){
            var data_pairs = [];
            var url_encoded_data = "";
            var default_role = "user";

            // get workspaceID
            var workspaceID = XHR_get_workspace_id.responseText.substring(1);
            console.log("workspaceID: " + workspaceID);


            // get user id
            var XHR_get_user_id  = new XMLHttpRequest();
            XHR_get_user_id.open('GET', '/get_user_id');
            XHR_get_user_id.send();
            XHR_get_user_id.onreadystatechange = function(){
                console.log("calling XHR_get_user_id");
                if (XHR_get_user_id.readyState == XMLHttpRequest.DONE){
                    var userID = XHR_get_user_id.responseText;
                    console.log("userID: " + userID);
                    data_pairs.push(encodeURIComponent("workspaceID") + '=' + encodeURIComponent(workspaceID));
                    data_pairs.push(encodeURIComponent("userID") + '=' + encodeURIComponent(userID));

                    data_pairs.push(encodeURIComponent("user role") + '=' + encodeURIComponent(default_role));
                    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

                    // add user into workspace
                    var XHR_add_user = new XMLHttpRequest();
                    XHR_add_user.open('POST', '/add_user');
                    XHR_add_user.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    XHR_add_user.send(url_encoded_data);

                }
            }


        }
    }



}



function delete_post_it(post_it_id) {
    var data_pairs = [];
    var url_encoded_data = "";

    data_pairs.push(encodeURIComponent("postitID") + '=' + encodeURIComponent(post_it_id));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/delete_post_it');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            console.log("deleted");
            var post_it = document.getElementById(post_it_id);
            remove_post_it(post_it);
        }
        
    }
    
}

function delete_event(event_id) {

}

var event_count = 0;
function generate_event(event_content, event_id, poster_name) {
    event_count++;
    var content = event_content;

    var event_card = document.createElement("DIV");

    if (is_admin == true) {
        hide_button = document.createElement("img");
        hide_button.className = "delete_event_button";
        hide_button.src = "/img/cross.png";
        /*hide_button.onclick = function() {delete_post_it(postit_id)};*/
        hide_button.style.display = "block";
        event_card.appendChild(hide_button);
    }
    event_card.id = event_id;
    var event_name_h1 = document.createElement("H1");
    event_name_h1.className = "event_title";
    var name = document.createTextNode("Event: ");
    event_name_h1.appendChild(name);
    event_name_h1.appendChild(document.createTextNode(content.eventName));
    event_card.appendChild(event_name_h1);

    var location_h2 = document.createElement("H2");
    location_h2.className = "event_location";
    var location = document.createTextNode("Location: ");
    location_h2.appendChild(location);
    location_h2.appendChild(document.createTextNode(content.location));
    event_card.appendChild(location_h2);

    var date_h2 = document.createElement("H2");
    date_h2.className = "event_date";
    var date = document.createTextNode("Date: ");
    date_h2.appendChild(date);
    date_h2.appendChild(document.createTextNode(content.date));
    event_card.appendChild(date_h2);

    var time_h2 = document.createElement("H2");
    time_h2.className = "event_time";
    var time = document.createTextNode("Time: ");
    time_h2.appendChild(time);
    var time_string = content.startTime + "-" + content.endTime;
    time_h2.appendChild(document.createTextNode(time_string));
    event_card.appendChild(time_h2);
    event_card.className = "event_card";

    user_posted = document.createElement("P");
    user_posted.className = "event_user_posted";
    user_posted.appendChild(document.createTextNode("- " + poster_name));
    event_card.appendChild(user_posted);

    document.getElementById("events").appendChild(event_card);
}

function create_event() {
    var data_pairs = [];
    var url_encoded_data = "";

    data_pairs.push(encodeURIComponent("eventName") + '=' +
                        encodeURIComponent(document.getElementById("event_name_box").value));

    data_pairs.push(encodeURIComponent("location") + '=' +
                        encodeURIComponent(document.getElementById("location_box").value));

    data_pairs.push(encodeURIComponent("date") + '=' +
                        encodeURIComponent(document.getElementById("date_box").value));

    data_pairs.push(encodeURIComponent("startTime") + '=' +
                        encodeURIComponent(document.getElementById("time_from_box").value));

    data_pairs.push(encodeURIComponent("endTime") + '=' +
                        encodeURIComponent(document.getElementById("time_to_box").value));


    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/submit_event');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);


    exit_event_submit();

}

function get_events() {
    var XHR = new XMLHttpRequest();

    XHR.open('GET', '/get_events');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            var events = JSON.parse(XHR.responseText);
            console.log(events);
            for (var i in events) {
                if (!document.getElementById(events[i]._id)){
                    generate_event(events[i], events[i]._id, events[i].user[0].firstname);
                }
            }
        }
    }
}

function remove_post_it(post_it) {
    console.log(coordinates)
    var postitsdiv = document.getElementById('postits');
    var index = -1;
    for (var i in coordinates) {
        if (coordinates[i][0] == parseInt(post_it.style.top, 10) && coordinates[i][1] == parseInt(post_it.style.left, 10)) {
            index = i;
        }
    }

    postitsdiv.removeChild(post_it);
    coordinates.splice(index, 1);
    console.log(index)
    console.log("c" + [parseInt(post_it.style.top, 10), parseInt(post_it.style.left, 10)])
    board_full = false;
    posts_on_page = [];
    for (var i in postitsdiv.children) {
        posts_on_page.push(postitsdiv.children[i].id);
    }
}

var board_full = false;
var posts_on_page = [];

function get_postits() {
    var XHR = new XMLHttpRequest();

    XHR.open('GET', '/get_post_its');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            var post_its = JSON.parse(XHR.responseText);
            post_its.reverse();
            check_posts(post_its);
            var broke = false;
            for (var i in post_its) {
                if (posts_on_page.indexOf(post_its[i]._id) == -1) {
                    var name = post_its[i].user[0].firstname;
                    var anonymous = post_its[i].anonymous;
                    var result = generate_postit(post_its[i].postItContent, post_its[i]._id, name, anonymous);
                    if (!result) {

                        broke = true;
                        break;
                    }
                }
            }

            if (broke) {
                for (var i in post_its) {
                    if (posts_on_page.indexOf(post_its[i]._id) == -1) {
                        posts_on_page.push(post_its[i]._id);
                    }
                }

                board_full = true;
            }
        }
    }
}

function like_post(post_id) {
    console.log("liked");
    var data_pairs = [];
    var url_encoded_data = "";

    data_pairs.push(encodeURIComponent("postitID") + '=' +
                        encodeURIComponent(post_id));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/like_post');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);
}

var coordinates = []

function generate_postit(postit_text, postit_id, postit_name, anonymous) {
    var text = postit_text;
    var postitsdiv = document.getElementById('postits');
    var postitsparent = document.getElementById('posits_parent');

    if (board_full) {
        remove_post_it(postitsdiv.lastChild);
    }

    console.log(document.getElementById('postits').offsetHeight);
    console.log(document.getElementById('postits_parent').offsetWidth);
    var sticky = document.createElement("DIV");
    sticky.className = "posted_sticky";
    // create a hide button for hiding posts, shown when hover
    if (is_admin == true) {
        hide_button = document.createElement("img");
        hide_button.className = "hide_posts_button";
        hide_button.src = "/img/cross.png";
        hide_button.onclick = function() {delete_post_it(postit_id)};
        hide_button.style.display = "block";
        sticky.appendChild(hide_button);
    }
    sticky.id = postit_id;
    var p = document.createElement("P");
    p.appendChild(document.createTextNode(text));
    sticky_text = document.createElement("DIV");
    sticky_text.className = "sticky_text";
    sticky_text.appendChild(p);
    sticky.appendChild(sticky_text);
        var name = document.createElement("P");
        if (anonymous == "no" || is_admin == false) {
            name.appendChild(document.createTextNode("- " + postit_name));
        }

        name.className = "sticky_author";
        sticky.appendChild(name);

    var score = document.createElement("P");
    score.className = "post_score";
    score.id = postit_id+"_likes";
    score.appendChild(document.createTextNode("0"));
    score.style.display = "block";
    sticky.appendChild(score);

    like_button = document.createElement("img");
    like_button.className = "like_button";
    like_button.src = "/img/like_button.png";
    like_button.style.display = "block";
    like_button.onclick = function() {like_post(postit_id);}
    sticky.appendChild(like_button);

    var ran_height = 0
    var ran_width = 0

    var attempts = 0
    placed = false;
    while (!placed) {
        console.log("repeated");
        ran_height = Math.floor(Math.random()*(postits_parent.offsetHeight-250)) + 1 + 50 ;
        ran_width = Math.floor(Math.random()*(postitsdiv.offsetWidth-250)) + 1;

        var continue_loop = false;
        for (var i in coordinates) {
            console.log(ran_height, ran_width);
            console.log(coordinates[i][0], coordinates[i][1]);
            if ((ran_width+250) >= coordinates[i][1] && (coordinates[i][1]+250) >= ran_width &&
                (ran_height+250) >= coordinates[i][0] && (coordinates[i][0]+250) >= ran_height) {

                continue_loop = true;
                break;
            }
        }

        if (continue_loop) {
            console.log("test2");
            attempts++;
            console.log(attempts);

            if (attempts > 200) {
                break;
            }

            continue;
        }

        placed=true;

    }

    if (!placed) {
        return false;
    }

    posts_on_page.push(postit_id);
    coordinates.push([ran_height, ran_width]);
    sticky.style.top = ran_height+'px';
    sticky.style.left = ran_width+'px';
    //name.style.top = ran_height+200+'px';
    //name.style.left = ran_width+200+'px';
    postitsdiv.appendChild(sticky);

    return true;
}

function get_likes() {
    var XHR = new XMLHttpRequest();

    XHR.open('GET', '/get_likes');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            var user_likes_val = document.getElementById("user_likes");
            user_likes_val.innerText = XHR.responseText + " 👍"
        }
    }
}

function check_posts(post_its) {
    var postitsdiv = document.getElementById('postits');
    for (var i = postitsdiv.children.length-1; i >= 0; i--) {
        var found = undefined;
        for (var j in post_its) {
            if (post_its[j]._id == postitsdiv.children[i].id) {
                found = post_its[j];
                break;
            }
        }

        if (found == undefined) {
            postitsdiv.removeChild(postitsdiv.children[i]);
        } else {
            var likes_val = document.getElementById(found._id + "_likes");
            likes_val.innerText = found.likes;
        }
    }
}






function create_postit() {
    var data_pairs = [];
    var url_encoded_data = "";
    var is_anonymous = "no";
    if(document.getElementById("is_anonymous").checked){
        is_anonymous = "yes";
    }
    data_pairs.push(encodeURIComponent("post_it_content") + '=' + encodeURIComponent(document.getElementById("sticky_submit_text").innerText));
    data_pairs.push(encodeURIComponent("anonymous") + '=' + encodeURIComponent(is_anonymous));
    data_pairs.push(encodeURIComponent("hide") + '=' + encodeURIComponent("false"));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/submit_post_it');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);


    exit_note_submit();
}




<!-- Sidebar control -->
function w3_open() {
    document.getElementById("main").style.marginLeft = "25%";
    document.getElementById("mySidebar").style.width = "25%";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
    document.getElementById("true").style.display = "block"
}
function w3_close() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}


get_events();
get_postits();

window.setInterval(function(){
    get_likes();
    get_events();
    get_postits();
}, 1000);


