import { logout } from '../Utility/utility.js';

const backendIPAddress = 'localhost:3000';

function authorizeApplication() {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
  console.log('Authorized');
}

export default function LoginPage() {
  document.getElementById('app').innerHTML = `
    <header>
      <div class="login-container">
        <div class="title">
          <h1>My Course Woo</h1>
          <h2>Assignments Management App</h2>
          <div class="logo">
            <img src="./pictures/bro.svg" alt="">
            <h3>Easy Grade Management</h3>
          </div>
        </div>
        <div class="blue-con">
          <h1>Welcome</h1>
          <p>Please login with<br>MyCourseVille to continue</p>
          <a href="#" id="loginBtn">Login with MyCourseVille</a>
          <a href="#" id="logoutBtn">Logout</a>
        </div>
      </div>
    </header>
  `;
  document
    .getElementById('loginBtn')
    .addEventListener('click', authorizeApplication);
  document.getElementById('logoutBtn').addEventListener('click', logout);
  return;
}
