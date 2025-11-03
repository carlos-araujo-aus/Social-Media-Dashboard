const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const findPostsForm = document.getElementById("findPostsForm")
const postForm = document.getElementById("postForm")

const postList = document.getElementById("posts-list");
const isLoading = document.getElementById("posts-loading");

const myPostsBtn = document.getElementById("mypostsbtn");
const allPostsBtn = document.getElementById("allPosts");
const logoutBtn = document.getElementById("logout")
const listAllUsersBtn = document.getElementById("listAllUsers")
const userByUsernameBtn = document.getElementById("userByUsername")
const sendPostBtn = document.getElementById("sendPost")

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
    postList.style.display = "block"
    postList.innerHTML = '<p>Loading...</p>'

    try {
        const response = await fetch("/my-posts")
        if(!response.ok) {
            throw new Error("Failed to fetch your posts");
        }
        const result = await response.json();
        const posts = result.allMyPosts;
        const username = result.username;
        console.log(posts)
        if (posts.length > 0) {
            postList.innerHTML = posts.map(i => 
                `
                <p><strong>Date: </strong>${new Date(i.date).toLocaleDateString()}</p>
                <p><strong>Text: </strong>${i.text}</p>
                <p><strong>Username: </strong>${username}</p>
                </br>
                `
            ).join("");
        } else {
            postList.innerHTML = `
                <p><strong>You do not hjave any post yet</p>
            `
        }
    } catch (error) {
        console.error("Error: " , error);
    }
}

const handleAllPosts = async (e) => {
    e.preventDefault()
    postList.style.display = "block"
    postList.innerHTML = '<p>Loading...</p>'

    try {
        const response = await fetch("/all-posts")
        if (!response.ok) {
            throw new Error("Failed to fetch posts");
        }      
        const result = await response.json()
        if (result.length > 0) {
            postList.innerHTML = result.map(i => 
                `
                <p><strong>Date: </strong>${new Date(i.createdAt).toLocaleDateString()}</p>
                <p><strong>Text: </strong>${i.text}</p>
                <p><strong>Username: </strong>${i.username}</p>
                </br>
                `
            ).join("");
        } else {
            postList.innerHTML = `
                <p><strong>There is no posts yet</p>
            `
        }
    } catch (error) {
        console.error("Error: " , error)
    }
}

const handleListAllUsers = async (e) => {
    e.preventDefault();
    postList.style.display = "block"
    postList.innerHTML = '<p>Loading...</p>'

    try {
        const response = await fetch("/all-users");
        const result = await response.json();
        const usernames = result.usernames;
        if (usernames.length === 0) {
            throw new Error("There was an error fetching the data");            
        } else {
            postList.innerHTML = usernames.map(i => 
                `
                <p><strong>${i}</p>
                </br>
                `
            ).join("");
        }
    } catch (error) {
        console.error("Error: " , error);
    }
}

const handleShowFindUserForm = async (e) => {
    try {
        e.preventDefault()
        postList.style.display = "none"
        findPostsForm.style.display = "block"
    } catch (error) {
        console.error("Error: " , error)
    }
}

const handleUserByUsername = async (e) => {
    e.preventDefault()
    postList.innerHTML = '<p>Loading...</p>'
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const userToFind = data.text.trim()
        if (userToFind === "") {
            throw new Error("User input is incorrect");            
        } 
        const response = await fetch (`/postbyusername/${userToFind}`)

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || `User ${userToFind} not found`);
        }

        const result = await response.json()
        const posts = result.posts
        const username = result.username
        
        if (!posts || posts.length === 0) {
            postList.innerHTML = 
                `
                <p>The user <strong>${userToFind}</strong> has no posts yet</p>
                `
        } else {
            postList.style.display = "block"
            postList.innerHTML = posts.map(i => 
                `
                <p><strong>Username: </strong>${username}</p>
                <p><strong>Date: </strong>${new Date(i.createdAt).toLocaleDateString()}</p>
                <p><strong>Text: </strong>${i.text}</p>
                </br>
                `
            ).join("")
        }
        e.target.reset();
    } catch (error) {
        console.error("Error: " , error);
        postList.innerHTML = `<p style="color: red; text-align: center;">❌ ${error.message}</p>`;
    }
}

const handleSendPost = async (e) => {
    e.preventDefault()
    postList.style.display = "block"
    postList.innerHTML = '<p>Loading...</p>'
    try {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        const text = data.postText.trim()
        if (text === "") {
            postList.innerHTML = 
                `
                <p>Please type your message before send</p>
                `
        }
        const response = await fetch ("/post", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({text})
        })
        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "There was an error sending your post");
        } else {
            postList.innerHTML =  `
            <p style="color: green; text-align: center;"><strong>✅ your post has been posted!</p>
            `
        }
        e.target.reset();
    } catch (error) {
        console.error("Error: " , error);
        postList.innerHTML = `<p style="color: red; text-align: center;">❌ ${error.message}</p>`;
    }
}


const handleLogout = async (e) => {
    e.preventDefault();
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
listAllUsersBtn?.addEventListener("click", handleListAllUsers)
userByUsernameBtn?.addEventListener("click", handleShowFindUserForm)
findPostsForm?.addEventListener("submit", handleUserByUsername)
postForm?.addEventListener("submit", handleSendPost)