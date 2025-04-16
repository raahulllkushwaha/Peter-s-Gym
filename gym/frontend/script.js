
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".navbar");
    const toggleBar = document.querySelector(".toggle");
    const menuBar = document.querySelector(".navbar-menu");
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");
    const scrollButton = document.getElementById("scrollToTop");
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll("nav ul li a");

    if (!navbar || !toggleBar || !menuBar || !scrollButton) {
        console.error("Required elements not found");
        return;
    }

    // Navbar toggle for mobile
    toggleBar.addEventListener("click", function () {
        toggleBar.classList.toggle("active");
        menuBar.classList.toggle("active");
    });

    // Register Form Submission
if (registerForm) {
    document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevent default form submission

    let membershipElement = document.getElementById("membership");
    let membershipValue = membershipElement?.value?.trim() || "";

    if (!membershipValue) {
        alert("⚠ Please select a membership plan!");
        return;
    }

    let formData = {
        name: document.getElementById("name")?.value?.trim() || "",
        email: document.getElementById("email")?.value?.trim() || "",
        password: document.getElementById("password")?.value?.trim() || "",
        phone: document.getElementById("phone")?.value?.trim() || "",
        membership: membershipValue,
        message: document.getElementById("message")?.value?.trim() || "",
        gender: document.querySelector('input[name="gender"]:checked')?.value || ""
    };

    console.log("🔥 Form Data Before Sending:", formData);

    try {
        let response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        let data = await response.json();
        console.log("🔹 Server Response:", data);

        if (data.success) {  
            alert("✅ Registration Successful! 🎉");
            document.getElementById("registerForm").reset();
        } else {
            alert(`❌ Registration Failed: ${data.msg || "Please try again!"}`);
        }
    } catch (error) {
        console.error("❌ Error:", error);
        alert("⚠ Something went wrong. Please try again later!");
    }
});

}




    // Login Form Submission
    if (loginForm) {
        document.getElementById("loginForm").addEventListener("submit", function(event) {
            event.preventDefault(); // ✅ Prevent page reload

            let formData = {
                email: document.getElementById("loginEmail").value.trim(),
                password: document.getElementById("loginPassword").value.trim()
            };

            console.log("🔥 Sending Login Data:", formData);

            fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                console.log("🔹 Server Response:", data);

                if (data.success) {
                    alert(data.msg);
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("role", data.role);

                    if (data.role === "admin") {
                        window.location.href = "/admin-dashboard.html";
                    } else {
                        window.location.href = "/user-dashboard.html";
                    }
                    document.getElementById("loginForm").reset();
                } else {
                    alert(data.msg);
                }
            })
            .catch(error => {
                console.error("❌ Error:", error);
                alert("⚠ Something went wrong. Please try again later!");
            });
        });

    }

    // Scroll behavior & Active Navigation Highlight
    window.addEventListener("scroll", function () {
        navbar.classList.toggle("sticky", window.scrollY > 50);
        scrollButton.classList.toggle("visible", window.scrollY > 300);

        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - 60 && window.scrollY < sectionTop + sectionHeight - 60) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href").substring(1) === current) {
                link.classList.add("active");
            }
        });
    });

    // Scroll to top
    scrollButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});