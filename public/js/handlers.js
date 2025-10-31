const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const myPostsBtn = document.getElementById("mypostsbtn");
const postList = document.getElementById("posts-list");
const isLoading = document.getElementById("posts-loading");
const allPostsBtn = document.getElementById("allPosts");
const logoutBtn = document.getElementById("logout")

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

const handleMyPosts = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch("/my-posts")
        if (response.ok) {
            const result = await response.json();
            const posts = result.allMyPosts;
            const username = result.username;

            console.log(posts)
            console.log(username)

            if (posts.length > 0) {
                postList.innerHTML = posts.map(i => 
                    `
                    <p><strong>Date: </strong>${new Date(i.date).toLocaleDateString()}</p>
                    <p><strong>Text: </strong>${i.text}</p>
                    <p><strong>Username: </strong>${username}</p>
                    `
                );
            }             
        } 
    } catch (error) {
        console.error("Error: " , error);
    }
}

const handleAllPosts = async (e) => {
    e.preventDefault
    try {
        const response = await fetch("/all-posts")
        if (response.ok) {
            const result = await response.json()
            postList.innerHTML = result.map(i => 
                `
                <p><strong>Date: </strong>${new Date(i.createdAt).toLocaleDateString()}</p>
                <p><strong>Text: </strong>${i.text}</p>
                <p><strong>Username: </strong>${i.username}</p>
                `
            );
        }        
    } catch (error) {
        console.error("Error: " , error)
    }
}

const handleLogout = async (e) => {
    e.preventDefault
    try {
        const response = await fetch("/logout")
        if (response.ok) {
            result = await response.json()
            console.log("Success: " , result);
            alert("Logout successful!");
            window.location.href = "/login.html"
        }
    } catch (error) {
        console.error("Error: " , error)
    }
}

const handleIsLoading = async (e) => {
    e.preventDefault();
    if (postList === ""){
        isLoading.innerHTML = `Is loading ...`
    } else {
        isLoading.innerHTML = ``
    }
}



loginForm?.addEventListener("submit", handleLoginSubmit);
registerForm?.addEventListener("submit", handleRegisterSubmit);
myPostsBtn?.addEventListener("click", (e) => {
    handleMyPosts(e);
    handleIsLoading(e); 
})
allPostsBtn?.addEventListener("click", handleAllPosts);
logoutBtn?.addEventListener("click", handleLogout)
