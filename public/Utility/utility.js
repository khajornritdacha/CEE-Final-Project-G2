import { BACKEND_URL } from './constant';

export const getUserProfile = async () => {
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
  window.location.href = `${BACKEND_URL}/courseville/logout`;
};
