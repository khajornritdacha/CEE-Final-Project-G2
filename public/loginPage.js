const BACKEND_URL = 'localhost:3000';

function authorizeApplication() {
  window.location.href = `${BACKEND_URL}/courseville/auth_app`;
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

export const getUserProfile = async () => {
  /** @type {RequestInit} */
  const options = {
    method: 'GET',
    credentials: 'include',
  };
  await fetch(`${BACKEND_URL}/courseville/get_profile_info`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log(data.user);
      document.getElementById(
        'eng-name-info'
      ).innerHTML = `${data.user.title_en} ${data.user.firstname_en} ${data.user.lastname_en}`;
      document.getElementById(
        'thai-name-info'
      ).innerHTML = `${data.user.title_th} ${data.user.firstname_th} ${data.user.lastname_th}`;
    })
    .catch((error) => console.error(error));
};

export const logout = async () => {
  //   window.location.href = `${BACKEND_URL}/courseville/logout`;
};
