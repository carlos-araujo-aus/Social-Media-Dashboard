const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
            console.log("Success: " , result);
            alert("Registration successful!");
            window.location.href = "/login.html"
        } else {
            throw new Error(result.message ||"Registration Failed");                        
        }
    } catch (error) {
        console.error("Error: " , error);
        alert("Error: " + error.message);
    }
};

const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type":"application/json" },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        
        if(response.ok) {
            console.log("Success: " , result);
            alert("Login successful");
            window.location.href = "/dashboard.html"
        } else {
            throw new Error(result.message || "Login Failed");
        }
    } catch (error) {
        console.error("Error: " , error);
        alert("Error: " + error.message);
    }
};

loginForm?.addEventListener("submit", handleLoginSubmit);
registerForm?.addEventListener("submit", handleRegisterSubmit);
