/**
 * Created by Happy Vibes Co. for INFO30005 Sem1 2018
 */

var workspaces = [];

function login() {
    if (workspaces.length > 1){
        open_workspace_overlay()
    }
    else{
        window.location.href="/board_page";
    }
}

function open_workspace_overlay() {
    document.getElementById("workplace_overlay").style.display = "block";
    document.getElementById("motivational_message").style.display = "none";
    document.getElementById("login_control").style.display = "none";
}

// get workspaces that the user joined
function get_workspaces() {
    var XHR = new XMLHttpRequest();
    XHR.open('GET', '/get_workspaces');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            workspaces = JSON.parse(XHR.responseText);
            generate_workspaces(workspaces, workspaces.length);
            var continue_button = document.getElementById("btn_login");
            continue_button.style.display = "inline-block";
        }
    }
}

// generate all workspaces on welcome page
function generate_workspaces(workspaces, workspacesLength){
    for (var i= 0; i < workspacesLength; i++){
        console.log(workspaces[i])
        generate_workspace(workspaces[i].workspace_name, workspaces[i]._id)
    }
}

// generate a workspace on welcome page
function generate_workspace(workspace_name, workspace_id) {
    var workplaceoptiondiv = document.getElementById('workplace_options');
    console.log("Workplaceoptiondiv created");
    var workspace = document.createElement("DIV");
    console.log("Workspace created");
    workspace.className = "workspace-option";
    workspace.onclick = change_workspace;
    var p = document.createTextNode(workspace_name);
    p.className = "workspace-name";
    console.log(p.className);
    workspace_text = document.createElement("DIV");
    workspace_text.id = workspace_id;
    workspace_text.onclick = function() {change_workspace(workspace_id)};
    workspace_text.className = "workspace-option";
    workspace_text.appendChild(p);
    console.log("p appended to workspace_text");
    workplaceoptiondiv.appendChild(workspace_text);
    console.log("workspace text appended to workplace option div");
}

// change user's current workspace to another workspace
function change_workspace(workspace_ID) {

    var XHR = new XMLHttpRequest();
    XHR.open("POST", "/change_workspace_cookie");
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send("workspaceID="+workspace_ID);

    XHR.onreadystatechange = function() {
        window.location.href="/board_page";
    }
}

function exit_workspace_overlay() {
    document.getElementById("workplace_overlay").style.display = "none";
    document.getElementById("motivational_message").style.display = "block";
    document.getElementById("login_control").style.display = "block";
}

get_workspaces();