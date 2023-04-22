// ts-check

// Define Types
/**
 * @typedef  {Object} Course
 * @property {string} course_no
 * @property {string} cv_cid
 * @property {string} title
 * @property {string} semester
 * @property {string} year
 * @property {string} course_icon
 */

/**
 * @typedef  {Object} Item
 * @property {string} item_id
 * @property {string} title
 * @property {boolean} is_finished
 * @property {string} out_time
 * @property {string} due_time
 * @property {Course} course
 */

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

  // @ts-ignore (Dont remove this line)
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

/**
 * @param {string} html representing a single element
 * @return {ChildNode}
 */
function htmlToElement(html) {
  const template = document.createElement('template');
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
}

function DashBoardPage() {
  const pageContainer = htmlToElement(`
    <div
    class="grid justify-center"
    style="
    grid-template-rows: repeat(3, max-content);
    grid-template-columns: 90%;
    margin-bottom: 30px;
    "></div>`);

  const items = [
    {
      due_time: '1682096340',
      item_id: '849315',
      course: {
        cv_cid: '31887',
        semester: '2',
        course_icon:
          'https://www.mycourseville.com/sites/all/modules/courseville/files/thumbs/icon-default.png',
        course_no: '2304184',
        title: 'General Physics Laboratory II  [Section 1-12]',
        year: '2022',
      },
      student_id: '6532155621',
      out_time: '1675040402',
      is_finished: false,
      title: 'PRETEST: การทดลองที่ 35 การเหนี่ยวนำแม่เหล็กไฟฟ้า ',
    },
    {
      due_time: '1682096340',
      item_id: '849211',
      course: {
        cv_cid: '31887',
        semester: '2',
        course_icon:
          'https://www.mycourseville.com/sites/all/modules/courseville/files/thumbs/icon-default.png',
        course_no: '2304184',
        title: 'General Physics Laboratory II  [Section 1-12]',
        year: '2022',
      },
      student_id: '6532155621',
      out_time: '1675062331',
      is_finished: false,
      title: 'PRETEST: การทดลองที่ 17 เลนส์และกระจกโค้ง',
    },
  ];

  pageContainer.appendChild(Heading());
  pageContainer.appendChild(SearchBar());
  pageContainer.appendChild(CardList(items));
  pageContainer.appendChild(NavBar());

  app.appendChild(pageContainer);
}

function Heading() {
  const heading = htmlToElement(`
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
      `);
  return heading;
}

function SearchBar() {
  const searchBar = htmlToElement(`
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
    `);
  return searchBar;
}

/**
 * Get assigned time in unix and return readable time
 * @param {string} time
 * @return {string}
 */
function parseOutTime(time) {
  return time;
}

/**
 * Parse unix time to readable time and check if it is danger(is due in 24 hours)
 * @param {string} time
 * @return {{isDanger: boolean, leftTime: string, date: string}}
 */
// TODO: implement this function
function parseDueTime(time) {
  return {
    isDanger: true,
    leftTime: time,
    date: 'Mar, 12',
  };
}

/**
 * @param {Item} item
 * @returns {ChildNode}
 */
function SingleCard(item) {
  const remainingTime = parseDueTime(item.due_time);
  const singleCard = htmlToElement(`
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
              ${item.title}
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
             ${remainingTime.leftTime} 
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
              ${item.course.title}
            </p>
            <p
              class="text-xs primary"
              style="
                grid-column: 1 / span 1;
                grid-row: 8 / span 2;
                justify-self: start;
              "
            >
              ${remainingTime.date}
            </p>
          </div>
      `);

  const doneBtn = htmlToElement(`
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
      cursor: pointer;
    "
  >
    Done
  </div>`);
  doneBtn.addEventListener('click', () => {
    console.log(item.item_id);
  });
  singleCard.appendChild(doneBtn);
  return singleCard;
}

/**
 *
 * @param {Item[]} items
 * @returns {ChildNode}
 */
function CardList(items) {
  const cardList = htmlToElement(`
      <section
            class="grid grid-template-cols-1 justify-items-center"
            style="row-gap: 20px;"
            id="card-container"
          >
      </section>
      `);
  for (const item of items) {
    cardList.appendChild(SingleCard(item));
  }
  return cardList;
}

function NavBar() {
  const navBar = htmlToElement(`
      <nav class="flex items-center justify-around primary fixed bot-0 navbar">
          <i class="fa-solid fa-house fa-2xl"></i>
          <i class="fa-solid fa-question fa-2xl"></i>
          <i class="fa-solid fa-check fa-2xl"></i>
      </nav>
      `);
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
