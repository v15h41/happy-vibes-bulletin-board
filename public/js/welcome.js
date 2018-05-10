function login() {
    window.location.href="/board_page";
}

function open_workspace_overlay() {
    document.getElementById("workplace_overlay").style.display = "block";
    document.getElementById("motivational_message").style.display = "none";
    document.getElementById("login_control").style.display = "none";
}

function get_workspaces() {
    var XHR = XMLHttpRequest();
    XHR.open('GET', '/get_workspaces');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            var workspaces = JSON.parse(XHR.responseText);

            generate_workspaces(workspaces, workspaces.length);
        }
    }


}

function generate_workspaces(workspaces, workspacesLength){
    for (var i= 0; i < workspacesLength; i++){
        console.log(i);
    }
}


function exit_workspace_overlay() {
    document.getElementById("workplace_overlay").style.display = "none";
    document.getElementById("motivational_message").style.display = "block";
    document.getElementById("login_control").style.display = "block";
}

get_workspaces();