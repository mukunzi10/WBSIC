document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const messageBox = document.getElementById("message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // validate
        if (username === "" || password === "") {
            showMessage("Please enter both username and password", "error");
            return;
        }

        try {
            const response = await fetch("login.php", {
                method: "POST",
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
            });

            const result = await response.text();

            if (result === "success") {
                showMessage("Login successful! Redirecting...", "success");

                setTimeout(() => {
                    window.location.href = "dashboard.php";
                }, 1000);
            } else {
                showMessage("Invalid username or password", "error");
            }

        } catch (error) {
            showMessage("Connection error, please try again", "error");
        }
    });

    function showMessage(text, type) {
        messageBox.innerText = text;
        messageBox.style.color = type === "success" ? "green" : "red";
    }
});
