$(document).ready(() => {
    $("#newUserBtn").on("click", (ev) => {
        event.preventDefault();
        const email = $("#newEmail").val();
        const password = $("#newPassword").val();
        $.post("/api/signup", {
            email, password
        }).then(() => {
            location.replace("/emails");
        }).catch(() => {
            // don't use alert here:
            alert("Incorrect username or password!");
        });
    });
});