const BACKEND_URL = 'http://localhost:3000';

// LoginPage();
// const user = await getUserProfile();

// TODO: handle if user is already logged in
// if (user) {
// Heading();
// DashBoardPage();
// } else
//     LoginPage();
// }

const app = document.getElementById('app');

DashBoardPage();

const getUserProfile = async () => {
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

const logout = async () => {
  window.location.href = `${BACKEND_URL}/courseville/logout`;
};

function DashBoardPage() {
  // 0. fetch data
  // 1. add heading
  // 2. add body
  // 3. add nav bar
  const tmp = document.createElement('div');
  tmp.classList.add('grid');
  tmp.classList.add('justify-center');

  tmp.id = 'dashboard-container';

  tmp.style.gridTemplateRows = 'repeat(3, max-content)';
  tmp.style.gridTemplateColumns = '90%';
  tmp.style.marginBottom = '30px';

  tmp.appendChild(Heading());
  tmp.appendChild(SearchBar());
  tmp.appendChild(CardContainer());
  tmp.appendChild(NavBar());

  app.appendChild(tmp);
}

function Heading() {
  const heading = document.createElement('div');
  heading.innerHTML = `
      <section
            class="flex justify-between items-center"
            style="width: 100%; padding: 20px 0 14px"
          >
            <h1 class="inline-block text-6xl">Assigned</h1>
            <div class="flex justify-between primary">
              <i class="fa-solid fa-bell fa-lg"></i>
              <i
                class="fa-solid fa-right-from-bracket fa-lg"
                style="margin-left: 30px"
              ></i>
            </div>
          </section>
      `;
  console.log(heading.children[0]);
  return heading;
}

function SearchBar() {
  const searchBar = document.createElement('section');
  searchBar.innerHTML = `
      <form action="" class="flex justify-between" style="padding: 20px 0">
        <select name="course_no" id="coursesSelect" style="width: 100%">
          <option value="" selected>Any Courses</option>
          <option value="2110101">Com Prog</option>
          <option value="2110201">Com Eng Ess</option>
          <option value="2320101">Cal 1</option>
        </select>
        <button
          type="submit"
          class="rounded-md primary"
          style="width: clamp(60px, 20%, 100px); margin-left: 30px"
        >
          Go
        </button>
      </form>
    `;
  return searchBar;
}

function SingleCard() {
  const tmp = document.createElement('div');
  tmp.innerHTML = `
      <div
            class="grid grid-template-cols-4 grid-template-rows-9 rounded-lg card-container"
            style="width: 100%; height: 125px; padding: 10px"
          >
            <h3
              style="
                grid-column: 1 / span 3;
                grid-row: 1 / span 4;
                justify-self: start;
              "
              class="text-lg card-text"
            >
              Final Project: Preparation (Set up an EC2 instance)
            </h3>
            <div
              class="text-sm rounded-lg"
              style="
                grid-column: 4 / span 1;
                grid-row: 2 / span 3;
                background-color: #e65f5c;
                padding: 5px 7.5px;
                color: white;
                justify-self: end;
                align-self: start;
              "
            >
              1 hour
            </div>
            <p
              class="text-sm"
              style="
                grid-column: 1 / span 2;
                grid-row: 6 / span 2;
                justify-self: start;
                align-self: start;
              "
            >
              Com Eng Ess
            </p>
            <p
              class="text-xs primary"
              style="
                grid-column: 1 / span 1;
                grid-row: 8 / span 2;
                justify-self: start;
              "
            >
              Mar, 12
            </p>
            <div
              class="text-sm rounded-lg"
              style="
                grid-column: 4 / span 1;
                grid-row: 7 / span 3;
                background-color: #006ee9;
                padding: 5px 7.5px;
                color: white;
                justify-self: end;
                align-self: center;
              "
            >
              Done
            </div>
          </div>
      `;
  return tmp;
}

function CardContainer() {
  const tmp = document.createElement('div');
  tmp.innerHTML = `
      <section
            class="grid grid-template-cols-1 justify-items-center"
            style="row-gap: 20px; visibility: hidden"
            id="card-container"
          >
      </section>
      `;
  app.appendChild(tmp);
  const cardContainer = document.getElementById('card-container');

  //   1. remove card container from .div and insert it to upper level
  // 2. add cards to card container

  cardContainer.appendChild(SingleCard());

  return tmp;
}

function NavBar() {
  const navBar = document.createElement('div');
  navBar.innerHTML = `
      <nav class="flex items-center justify-around primary fixed bot-0 navbar">
          <i class="fa-solid fa-house fa-2xl"></i>
          <i class="fa-solid fa-question fa-2xl"></i>
          <i class="fa-solid fa-check fa-2xl"></i>
      </nav>
      `;
  return navBar;
}

function authorizeApplication() {
  console.log('Authorize');
}

function LoginPage() {
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
