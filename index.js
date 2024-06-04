document.getElementById("serverBtn").addEventListener("click", function() {
  // Получаем выбранный сервер
  var selectedServer = document.querySelector(".select select option:checked").textContent;
  // Сохраняем выбранный сервер в localStorage
  localStorage.setItem("selectedServer", selectedServer);
  // Перенаправляем пользователя на страницу pay.html
  window.location.href = "pay.html";
});

document.addEventListener('click', function(event) {
  var dropdown = document.querySelector('.dropdown'); // Обращаемся к классу, не идентификатору
  var dropdownContent = document.getElementById('dropdownContent');

  // Если клик был вне выпадающего окна, то закрываем его
  if (!dropdown.contains(event.target)) {
    dropdownContent.style.display = 'none';
  }
});

// Получаем key из URL
const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('key');

// Открываем ссылку с ключом при нажатии на кнопку "Подключиться"
const connectButton = document.getElementById('connectButton');
connectButton.addEventListener('click', () => {
    if (key) {
        window.open(`${key}`, '_blank');
    } else {
        alert('Ключ не найден');
    }
});
