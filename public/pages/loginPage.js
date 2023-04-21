function authorizeApplication() {
  console.log('Authorize');
}

export default function LoginPage() {
  document.getElementById('app').innerHTML = `
  <section>
      <header>
          <h1 id="app-name">MyCourseville API Login Page Group <span id="group-id"></span></h1>
      </header>
  </section>
  <section>
      <header>
          <h2 class="section-title description">Please press the login button to proceed to MyCourseville API Home Page</h2>
          <p class="section-subtitle description">(You need to login with MyCourseville Platform account.)</p>
      </header>
  </section>
  <section class="section-center">
      <button class="button login-button rounded-full" id="loginBtn">Login</button>
  </section>
  <section class="section-center">
      <button class="button change-page-button" onclick="window.location.href='index.html'">Go to รายการฝากซื้อ</button>
  </section>
  <section class="section-credit">
      &#169; 2110221 Computer Engineering Essentials (2022/2) &#169;
  </section>
`;
  document
    .getElementById('loginBtn')
    .addEventListener('click', authorizeApplication);
  return;
}
