function complete_new_user() {
    document.getElementById("buttons_to_hide").style.display = "none";
    document.getElementById("create_account_frame").style.display = "block";
}

function complete_existing_user() {
    document.getElementById("buttons_to_hide").style.display = "none";
    document.getElementById("existing_account_frame").style.display = "block";
}

function new_user_submit() {
    var data_pairs = [];
    var url_encoded_data = "";

    data_pairs.push(encodeURIComponent("firstname") + '=' + encodeURIComponent(document.getElementById("firstname").value));
    data_pairs.push(encodeURIComponent("lastname") + '=' + encodeURIComponent(document.getElementById("lastname").value));
    data_pairs.push(encodeURIComponent("email") + '=' + encodeURIComponent(document.getElementById("email").value));
    data_pairs.push(encodeURIComponent("password") + '=' + encodeURIComponent(document.getElementById("password").value));

    url_encoded_data = data_pairs.join('&').replace(/%20/g, '+');

    var XHR = new XMLHttpRequest();

    XHR.onreadystatechange = function() {
        if (XHR.readyState == XMLHttpRequest.DONE) {
            console.log(XHR.responseText);

            if (XHR.responseText.charAt(0) == "0") {
                document.getElementById("error_message").appendChild(document.createTextNode(XHR.responseText.substring(1)));
            }
        }
    }

    console.log(url_encoded_data);
    XHR.open('POST', '/submit_user');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send(url_encoded_data);


}

function submit_form() {
    var XHR = new XMLHttpRequest();

    XHR.open('POST', '/submit_newroom');
    XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    XHR.send("lol=lol1&lol1=lol2");
}