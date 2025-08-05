// Import Firebase functions from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAqnBAa5Y0JEbuFohgn6jS9gWvl3JGWors",
  authDomain: "pyq-hub-fb3bb.firebaseapp.com",
  projectId: "pyq-hub-fb3bb",
  storageBucket: "pyq-hub-fb3bb.firebasestorage.app",
  messagingSenderId: "5765004016",
  appId: "1:5765004016:web:fb7b745a6b64f27ada6035",
  measurementId: "G-VGRQNKZD0P"
};

// Initialize Firebasex
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Wait for DOM to load before attaching event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Handle Login Form
  const loginForm = document.getElementById("login-form");
  
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email")?.value;
      const password = document.getElementById("login-password")?.value;

      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert("Login successful!");
          console.log(userCredential.user);
          // Redirect to main page after successful login
          window.location.href = "index.html";
        })
        .catch((error) => {
          let errorMessage = "Login failed: ";
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage += "No account found with this email";
              break;
            case 'auth/wrong-password':
              errorMessage += "Incorrect password";
              break;
            case 'auth/invalid-email':
              errorMessage += "Invalid email address";
              break;
            case 'auth/too-many-requests':
              errorMessage += "Too many failed attempts. Please try again later";
              break;
            default:
              errorMessage += error.message;
          }
          alert(errorMessage);
        });
    });
  }

  // Handle Signup Form
  const signupForm = document.getElementById("signup-form");
  
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("signup-email")?.value;
      const password = document.getElementById("signup-password")?.value;
      const name = document.getElementById("name")?.value || "";

      if (!email || !password) {
        alert("Please fill in all required fields");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters long");
        return;
      }

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          alert("Account created successfully!");
          console.log(userCredential.user);
          // Redirect to main page after successful signup
          window.location.href = "index.html";
        })
        .catch((error) => {
          let errorMessage = "Signup failed: ";
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage += "An account with this email already exists";
              break;
            case 'auth/invalid-email':
              errorMessage += "Invalid email address";
              break;
            case 'auth/weak-password':
              errorMessage += "Password is too weak. Use at least 6 characters";
              break;
            default:
              errorMessage += error.message;
          }
          alert(errorMessage);
        });
    });
  }
});