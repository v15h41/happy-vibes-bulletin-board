/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

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
    document.getElementById("join_workspace_overlay").style.display = "none";
}

function open_join_workspace_overlay() {
    document.getElementById("join_workspace_overlay").style.display = "block";
}

function join_workspace() {
    //get entered workspaceID
    var workspace_name = document.getElementById("sticky_join_workspace_text").innerText;

    //get mongoDB workspace oid from database 
    var XHR_get_workspace_id = new XMLHttpRequest();
    XHR_get_workspace_id.open('GET', '/get_workspace_id/' + workspace_name);
    XHR_get_workspace_id.send();
    XHR_get_workspace_id.onreadystatechange = function () {
        if (XHR_get_workspace_id.readyState == XMLHttpRequest.DONE){
            var data_pairs = [];
            var url_encoded_data = "";
            var default_role = "user";

            // receive response
            var workspaceID = XHR_get_workspace_id.responseText.substring(1);

            // get mongoDB user oid from database
            var XHR_get_user_id  = new XMLHttpRequest();
            XHR_get_user_id.open('GET', '/get_user_id');
            XHR_get_user_id.send();
            XHR_get_user_id.onreadystatechange = function(){
                if (XHR_get_user_id.readyState == XMLHttpRequest.DONE){
                    var userID = XHR_get_user_id.responseText;
                    data_pairs.push(encodeURIComponent("workspaceID") + '=' + encodeURIComponent(workspaceID));
                    data_pairs.push(encodeURIComponent("userID") + '=' + encodeURIComponent(userID));

                    data_pairs.push(encodeURIComponent("user role") + '=' + encodeURIComponent(default_role));
                    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

                    // send user ID and workspace ID to the add user API
                    var XHR_add_user = new XMLHttpRequest();
                    XHR_add_user.open('POST', '/add_user');
                    XHR_add_user.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    XHR_add_user.send(url_encoded_data);

                }
            }


        }
    }

    //close overlay 
    exit_join_workspace();

}

//get oldest post on page
function get_oldest_post(post_its) {
    //filter out posts from post_its received by server to only those on page
    var post_its_on_page = [];
    var posts = document.getElementById('postits').children;
    for (var i in posts) {
        for (var j in post_its) {
            if (posts[i].id == post_its[j]._id) {
                post_its_on_page.push(post_its[j]);
            }
        }
    }

    //find the post on page with the oldest timestamp
    var min_timestamp = Number.MAX_SAFE_INTEGER;
    var oldest_post = undefined;
    for (var i in post_its_on_page) {
        if (min_timestamp > post_its_on_page[i].timestamp) {
            min_timestamp = post_its_on_page[i].timestamp;
            oldest_post = post_its_on_page[i]._id;
        }
    }

    //return the DOM node that is the oldest post
    return document.getElementById(oldest_post);
}

//sends API request to delete a post it
function delete_post_it(post_it_id, sticky) {
    sticky.className = "delete_sticky";

    var data_pairs = [];
    var url_encoded_data = "";

    data_pairs.push(encodeURIComponent("postitID") + '=' + encodeURIComponent(post_it_id));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/delete_post_it');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);        
}

//sends API request to delete an event
function delete_event(event_id, event_card) {
    var data_pairs = [];
    var url_encoded_data = "";
    event_card.className = "delete_event";
    data_pairs.push(encodeURIComponent("eventID") + '=' + encodeURIComponent(event_id));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/delete_event');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);

    //remove event from the DOM
    var events_div = document.getElementById("events");
    var event = document.getElementById(event_id);
    events_div.removeChild(event);

}

var event_count = 0;
//generate the DOM element for an event
function generate_event(event_content, event_id, poster_name) {
    event_count++;
    var content = event_content;

    //create outer div and give it attributes
    var event_card = document.createElement("DIV");
    event_card.className = "spawn_event";
    event_card.onmouseover = function () {changeEventClass(this)};

    //add delete button for admin users 
    if (is_admin == true) {
        hide_button = document.createElement("img");
        hide_button.className = "delete_event_button";
        hide_button.src = "/img/cross.png";
        //assign the onclick event a function with the event id and DOM element
        hide_button.onclick = function() {delete_event(event_id, event_card)};
        hide_button.style.display = "block";
        event_card.appendChild(hide_button);
    }
    event_card.id = event_id;

    //add event details to the event card
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

    user_posted = document.createElement("P");
    user_posted.className = "event_user_posted";
    user_posted.appendChild(document.createTextNode("- " + poster_name));
    event_card.appendChild(user_posted);

    //append event card to parent div
    document.getElementById("events").appendChild(event_card);
}

//change class for animation
function changeEventClass(event){
    event.className = "event_card";
}

//submit an event to the server API
function create_event() {
    var data_pairs = [];
    var url_encoded_data = "";

    //encode data
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

    //close overlay
    exit_event_submit();

}

//request events from server
function get_events() {
    var XHR = new XMLHttpRequest();

    XHR.open('GET', '/get_events');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            var events = JSON.parse(XHR.responseText);
            //generate an event if it is not in the DOM
            for (var i in events) {
                if (!document.getElementById(events[i]._id)){
                    generate_event(events[i], events[i]._id, events[i].user[0].firstname);
                }
            }
        }
    }
}

//delete post it
function remove_post_it(post_it) {
    //find post it details in arrays
    var postitsdiv = document.getElementById('postits');
    var index = -1;
    for (var i in coordinates) {
        if (coordinates[i][0] == parseInt(post_it.style.top, 10) && coordinates[i][1] == parseInt(post_it.style.left, 10)) {
            index = i;
        }
    }

    //remove the post it
    postitsdiv.removeChild(post_it);
    coordinates.splice(index, 1);
    //change board state to not full and repopulate tracking arrays
    board_full = false;
    posts_on_page = [];
    for (var i in postitsdiv.children) {
        posts_on_page.push(postitsdiv.children[i].id);
    }
}

var board_full = false;
var posts_on_page = [];

//get post its from server  
function get_postits() {
    //get post its
    var XHR = new XMLHttpRequest();

    XHR.open('GET', '/get_post_its');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            var post_its = JSON.parse(XHR.responseText);
            //parse posts and reverse them so that more recent posts are put on the board first
            post_its.reverse();
            //check if any posts have been deleted
            check_posts(post_its);

            //generate post its until it fails from being full 
            var broke = false;
            for (var i in post_its) {
                //only generate the post it if it is not tracked
                if (posts_on_page.indexOf(post_its[i]._id) == -1) {                    
                    var result = generate_postit(post_its, i);
                    if (!result) {
                        broke = true;
                        break;
                    }
                }
            }

            //if generating posts fails from being full, keep track of posts that could not make it to the page
            if (broke) {
                for (var i in post_its) {
                    if (posts_on_page.indexOf(post_its[i]._id) == -1) {
                        posts_on_page.push(post_its[i]._id);
                    }
                }

                //set the board to be full
                board_full = true;
            }
        }
    }
}

//send a request to the server, liking the post
function like_post(post_id) {
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

//generate the DOM elements for post its
function generate_postit(post_its, i) {
    //get data from post it array based on index
    var postit_name = post_its[i].user[0].firstname;
    var anonymous = post_its[i].anonymous;
    var postit_id = post_its[i]._id;
    var text = post_its[i].postItContent;
    var postitsdiv = document.getElementById('postits');
    var postitsparent = document.getElementById('posits_parent');

    //if the board is full, remove oldest post
    if (board_full) {
        remove_post_it(get_oldest_post(post_its));
    }

    var sticky = document.createElement("DIV");
    sticky.className = "spawn_sticky";
    sticky.onmouseover = function () {changeStickyClass(this)};
    // create a hide button for hiding posts, shown when hover
    if (is_admin == true) {
        hide_button = document.createElement("img");
        hide_button.className = "hide_posts_button";
        hide_button.src = "/img/cross.png";
        hide_button.onclick = function() {delete_post_it(postit_id, sticky)};
        hide_button.style.display = "block";
        sticky.appendChild(hide_button);
    }
    
    sticky.id = postit_id;

    //append content of post it 
    var p = document.createElement("P");
    p.appendChild(document.createTextNode(text));
    sticky_text = document.createElement("DIV");
    sticky_text.className = "sticky_text";
    sticky_text.appendChild(p);
    sticky.appendChild(sticky_text);
    var name = document.createElement("P");
    //append name to post it only if anonymous is no or if admin is true
    if (anonymous == "no" || is_admin == true) {
        name.appendChild(document.createTextNode("- " + postit_name));
    }

    name.className = "sticky_author";
    sticky.appendChild(name);

    //append likes
    var score = document.createElement("P");
    score.className = "post_score";
    score.id = postit_id+"_likes";
    score.appendChild(document.createTextNode("0"));
    score.style.display = "block";
    sticky.appendChild(score);

    //append like button
    like_button = document.createElement("img");
    like_button.className = "like_button";
    like_button.src = "/img/like_button.png";
    like_button.style.display = "block";
    //set on click listener to function with post it ID
    like_button.onclick = function() {like_post(postit_id);}
    sticky.appendChild(like_button);

    var ran_height = 0
    var ran_width = 0

    //attempt to post post it to random locations on the board
    var attempts = 0
    placed = false;
    while (!placed) {
        //generate random location
        ran_height = Math.floor(Math.random()*(postits_parent.offsetHeight-250)) + 1 + 50 ;
        ran_width = Math.floor(Math.random()*(postitsdiv.offsetWidth-250)) + 1;

        //loop through all post its on page to see if there's any overlap
        var continue_loop = false;
        for (var i in coordinates) {
            if ((ran_width+250) >= coordinates[i][1] && (coordinates[i][1]+250) >= ran_width &&
                (ran_height+250) >= coordinates[i][0] && (coordinates[i][0]+250) >= ran_height) {
                
                //if there's an overlap, keep searching
                continue_loop = true;
                break;
            }
        }
        
        if (continue_loop) {
            attempts++;

            //check if attempts don't exceed 200 
            if (attempts > 200) {
                break;
            }

            continue;
        }

        //if no overlap, set placed to true
        placed=true;

    }

    //if not placed, return false
    if (!placed) {
        return false;
    }

    //if placed, put post it on page
    posts_on_page.push(postit_id);
    coordinates.push([ran_height, ran_width]);
    sticky.style.top = ran_height+'px';
    sticky.style.left = ran_width+'px';
    postitsdiv.appendChild(sticky);

    return true;
}

//change class on hover
function changeStickyClass(sticky){
    sticky.className = "posted_sticky";
}

//get number of likes for the logged in user 
function get_likes() {
    var XHR = new XMLHttpRequest();

    XHR.open('GET', '/get_likes');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            //update the likes component with user likes
            var user_likes_val = document.getElementById("user_likes");
            user_likes_val.innerText = XHR.responseText + " 👍"
        }
    }
}

//check if any post its are deleted 
function check_posts(post_its) {
    //get parent div
    var postitsdiv = document.getElementById('postits');
    //check if there are any post its that are on the page but not in the post its received by the server
    for (var i = postitsdiv.children.length-1; i >= 0; i--) {
        var found = undefined;
        for (var j in post_its) {
            if (post_its[j]._id == postitsdiv.children[i].id) {
                found = post_its[j];
                break;
            }
        }

        //if the post it is not found, delete it
        if (found == undefined) {
            remove_post_it(postitsdiv.children[i]);
        } else {
            //if post it is found, update its likes
            var likes_val = document.getElementById(found._id + "_likes");
            likes_val.innerText = found.likes;
        }
    }
}

//submit post it to the server
function create_postit() {
    var data_pairs = [];
    var url_encoded_data = "";
    var is_anonymous = "no";
    if(document.getElementById("is_anonymous").checked){
        is_anonymous = "yes";
    }

    //encode post it data
    data_pairs.push(encodeURIComponent("post_it_content") + '=' + encodeURIComponent(document.getElementById("sticky_submit_text").innerText));
    data_pairs.push(encodeURIComponent("anonymous") + '=' + encodeURIComponent(is_anonymous));
    data_pairs.push(encodeURIComponent("hide") + '=' + encodeURIComponent("false"));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/submit_post_it');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);

    //close the overlay
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
get_likes();

//poll for updates
window.setInterval(function(){
    get_likes();
    get_events();
    get_postits();
}, 1000);


//on window resize, remove all post its and repostion them
function resize() {
    var postitsdiv = document.getElementById('postits');
    postitsdiv.innerHTML = "";
    posts_on_page = [];
    coordinates = []
    board_full = false;
}