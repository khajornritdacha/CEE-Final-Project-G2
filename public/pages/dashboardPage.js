export default function DashBoardPage() {
  const navBar = `
  <nav class="flex align-center space-around primary fixed bot-0 navbar">
  <i class="fa-solid fa-house fa-2xl"></i>
  <i class="fa-solid fa-question fa-2xl"></i>
  <i class="fa-solid fa-check fa-2xl"></i>
    `;

  document.getElementById('app').innerHTML = navBar;
}
