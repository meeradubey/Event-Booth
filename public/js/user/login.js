$(document).ready(() => {
    $(document).on("submit", ".user-form", function (event) {
        event.preventDefault();
        const email = $("#email").val();
        const password = $("#password").val();
        $.post("/api/login", {
            email, password
        }).then(() => {
            return location.replace("/");
        }).catch(() => {
            // don't use alert here:
            alert("Incorrect username or password!");
        });
    });
});