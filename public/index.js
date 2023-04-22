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

/**
 * @enum {number}
 */
const ItemStatus = {
  SAFE: 0,
  DANGER: 1,
  MISSED: 2,
};

const BACKEND_URL = 'http://localhost:3000';

let GLOBAL_PAGE = 0;

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

RoutePage(0);

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

/**
 *
 * @param {number} pageNo
 */
function DashBoardPage(pageNo) {
  const pageContainer = htmlToElement(`
    <div
    class="grid justify-center"
    style="
    grid-template-rows: repeat(3, max-content);
    grid-template-columns: 90%;
    margin-bottom: 100px;
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
    {
      due_time: '1683133140',
      item_id: '923116',
      course: {
        cv_cid: '33808',
        semester: '2',
        course_icon:
          'https://www.mycourseville.com/sites/all/modules/courseville/files/thumbs/2302127.png',
        course_no: '2302127',
        title: 'General Chemistry  [Section 1-2]',
        year: '2022',
      },
      student_id: '6532155621',
      out_time: '1681115461',
      is_finished: false,
      title: 'แบบฝึกหัดที่ 6-1 หลังกลางภาค: กรด-เบส ชุดที่ 1',
    },
    {
      due_time: '1683133140',
      item_id: '923106',
      course: {
        cv_cid: '33808',
        semester: '2',
        course_icon:
          'https://www.mycourseville.com/sites/all/modules/courseville/files/thumbs/2302127.png',
        course_no: '2302127',
        title: 'General Chemistry  [Section 1-2]',
        year: '2022',
      },
      student_id: '6532155621',
      out_time: '1681115559',
      is_finished: false,
      title: 'แบบฝึกหัดที่ 7 หลังกลางภาค: เคมีนิวเคลียร์',
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
            <h1 class="inline-block text-6xl" id="page-header">Assigned</h1>
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
 *
 * @param {string} unixDueTime
 * @returns {string}
 */
function formatRemainingTime(unixDueTime) {
  const now = new Date().getTime() / 1000;
  const diff = Number(unixDueTime) - now;

  if (diff > 365 * 24 * 3600) {
    const years = Math.floor(diff / (365 * 24 * 3600));
    return `${years} year${years > 1 ? 's' : ''}`;
  } else if (diff > 30 * 24 * 3600) {
    const months = Math.floor(diff / (30 * 24 * 3600));
    return `${months} month${months > 1 ? 's' : ''}`;
  } else if (diff > 24 * 3600) {
    const days = Math.floor(diff / (24 * 3600));
    return `${days} day${days > 1 ? 's' : ''}`;
  } else if (diff > 3600) {
    const hours = Math.floor(diff / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  } else if (diff > 60) {
    const minutes = Math.floor(diff / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  } else if (diff > 0) {
    return '< 1 minute';
  } else {
    return 'missed';
  }
}

/**
 * Parse unix time to readable time and check if it is danger(is due in 24 hours)
 * @param {string} time
 * @return {{status: ItemStatus, leftTime: string, date: string}}
 */
// TODO: implement this function
function parseDueTime(time) {
  const d = new Date(Number(time) * 1000);
  const currentTime = new Date().getTime() / 1000;
  const diffTime = Number(time) - currentTime;
  const date = d
    .toLocaleTimeString([], { day: 'numeric', month: 'short' })
    .split(',')[0];
  const leftTime = formatRemainingTime(time);
  const status =
    diffTime < 0
      ? ItemStatus.MISSED
      : diffTime < 24 * 3600
      ? ItemStatus.DANGER
      : ItemStatus.SAFE;
  return {
    status,
    leftTime,
    date,
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
            style="width: 100%; height: 125px; padding: 10px;"
          >
            <a
              class="card-title"
              href="https://www.mycourseville.com/?q=courseville/worksheet/${
                item.course.cv_cid
              }/${item.item_id}"
              target="_blank"
            >
              ${item.title}
            </a>
            <div
              class="text-sm rounded-lg"
              style="
                grid-column: 4 / span 1;
                grid-row: 2 / span 3;
                background-color: ${
                  remainingTime.status === 0 ? '#4A4646' : '#e65f5c'
                };
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
      <nav class="flex items-center justify-around fixed bot-0 navbar">
          <i class="fa-solid fa-house fa-2xl" id="home-icon" style="cursor: pointer"></i>
          <i class="fa-solid fa-question fa-2xl" id="miss-icon" style="cursor: pointer"></i>
          <i class="fa-solid fa-check fa-2xl" id="done-icon" style="cursor: pointer"></i>
      </nav>
      `);

  return navBar;
}

/**
 *
 * @param {number} pageNo
 */
function RoutePage(pageNo) {
  GLOBAL_PAGE = pageNo;
  app.innerHTML = '';
  if (pageNo === 0) {
    DashBoardPage(0);
    document.getElementById('page-header').innerText = 'Assigned';
    const icon = document.getElementById('home-icon');
    icon.classList.add('primary');
  } else if (pageNo === 1) {
    DashBoardPage(1);
    document.getElementById('page-header').innerText = 'Missed';
    const icon = document.getElementById('miss-icon');
    icon.classList.add('primary');
  } else if (pageNo === 2) {
    DashBoardPage(2);
    document.getElementById('page-header').innerText = 'Done';
    const icon = document.getElementById('done-icon');
    icon.classList.add('primary');
  }
  document.getElementById('home-icon').addEventListener('click', () => {
    RoutePage(0);
  });
  document.getElementById('miss-icon').addEventListener('click', () => {
    RoutePage(1);
  });
  document.getElementById('done-icon').addEventListener('click', () => {
    RoutePage(2);
  });
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
