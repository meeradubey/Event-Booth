$(document).ready(() => {
    $(document).on("submit", ".user-form", function (event) {
        event.preventDefault();
        const email = $("#email").val();
        const password = $("#password").val();
        const repassword = $("#re-password").val();
        if (password !== repassword) {
            // don't use alert here:
            alert("passwords must match!");
            password.val("");
            repassword.val("");
            return;
        }
        $.post("/api/signup", {
            email, password
        }).then(() => {
            location.replace("/");
        }).catch(() => {
            // don't use alert here:
            alert("Incorrect username or password!");
        });
    });
});