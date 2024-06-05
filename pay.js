// Получаем все элементы с классом "plan"
const plans = document.querySelectorAll('.plan');
const selectedServer = document.querySelector('.selected-server');
const nextButton = document.getElementById('nextButton');
const planBlock = document.querySelector('.plan-block');
const paymentBlock = document.querySelector('.payment-block');
const steps = document.querySelectorAll('.step');
const sendDataBtn = document.querySelector('.send-data-btn');
const subscriptionTitle = document.getElementById('subscriptionTitle');
const selectedOptions = document.querySelector('.selected-options');

// Определяем переменную currentStep и устанавливаем ее начальное значение
let currentStep = 0;

// Добавляем обработчики событий для выбора плана
plans.forEach(plan => {
    plan.addEventListener('click', () => {
        // Убираем класс "selected" у всех планов
        plans.forEach(p => p.classList.remove('selected'));
        // Добавляем класс "selected" к выбранному плану
        plan.classList.add('selected');
        // Активируем кнопку "Далее"
        nextButton.disabled = false;
        // Устанавливаем цвет кнопки "Далее" для выбранного плана
        nextButton.style.backgroundColor = '#007bff';
        nextButton.style.color = '#fff';
    });
});

// Обработчик события для кнопки "Далее"
nextButton.addEventListener('click', () => {
    const selectedPlanElement = document.querySelector('.plan.selected .name');
    const selectedPlan = selectedPlanElement ? selectedPlanElement.textContent : '';

    if (currentStep === 0) {
        if (selectedPlan === '5 дней') {
            // Пропустить шаг оплаты и перейти к последнему шагу
            planBlock.style.display = 'none';
            paymentBlock.style.display = 'none'; // Скрыть блок с выбором способа оплаты

            selectedServer.textContent = 'Выбранный сервер: ' + localStorage.getItem('selectedServer');
            const selectedPlanField = document.querySelector('.selected-plan');
            selectedPlanField.textContent = 'Выбранный план: ' + selectedPlan;
            
            // Показать блок с выбранными параметрами
            selectedOptions.style.display = 'block';
            // Убираем выбранный способ оплаты, если план 5 дней
            document.querySelector('.selected-payment').style.display = 'none';
            // Обновляем текст заголовка на "Все верно?"
            subscriptionTitle.textContent = 'Все верно?';
            // Устанавливаем третий кружок активным
            steps[2].classList.add('active');
            // Устанавливаем иконку для третьего кружка
            document.querySelectorAll('.step-icon')[2].innerHTML = '<i class="fas fa-check-circle"></i>';
            nextButton.textContent = 'Получить доступ';

            // Скрываем кнопку "Перейти к оплате"
            nextButton.style.display = 'none';
            // Показываем кнопку "Отправить данные в бот"
            sendDataBtn.style.display = 'block';
        } else {
            // Переключаемся на блок с выбором способа оплаты
            planBlock.style.display = 'none';
            paymentBlock.style.display = 'block';
            // Обновляем текст заголовка
            subscriptionTitle.textContent = 'Варианты оплаты';
            // Обновляем текущий шаг
            currentStep++;
            // Активируем следующий шаг в индикаторе
            steps[currentStep].classList.add('active');
            // Устанавливаем иконку для текущего шага
            document.querySelectorAll('.step-icon')[currentStep].innerHTML = '<i class="fas fa-check-circle"></i>';
        }
    } else if (currentStep === 1) {
        const selectedPaymentOption = document.querySelector('.payment-option.selected');
        if (selectedPaymentOption) {
            // Код для перехода к следующему шагу
            planBlock.style.display = 'none';
            paymentBlock.style.display = 'none'; // Скрыть блок с выбором способа оплаты
            const selectedPlanField = document.querySelector('.selected-plan');
            const selectedPaymentField = document.querySelector('.selected-payment');
            selectedServer.textContent = 'Выбранный сервер: ' + localStorage.getItem('selectedServer');
            selectedPlanField.textContent = 'Выбранный план: ' + selectedPlan;
            selectedPaymentField.textContent = 'Выбранный способ оплаты: ' + selectedPaymentOption.querySelector('.name').textContent;
            // Показать блок с выбранными параметрами
            selectedOptions.style.display = 'block';
            // Обновляем текст заголовка на "Все верно?"
            subscriptionTitle.textContent = 'Все верно?';
            // Устанавливаем третий кружок активным
            steps[2].classList.add('active');
            // Устанавливаем иконку для третьего кружка
            document.querySelectorAll('.step-icon')[2].innerHTML = '<i class="fas fa-check-circle"></i>';
            nextButton.textContent = 'Перейти к оплате';

            // Скрываем кнопку "Перейти к оплате"
            nextButton.style.display = 'none';
            // Показываем кнопку "Отправить данные в бот"
            sendDataBtn.style.display = 'block';
        } else {
            // Способ оплаты не выбран, выводим сообщение или предупреждение
            alert('Пожалуйста, выберите способ оплаты');
        }
    }
});

// Обработчик события для выбора варианта оплаты
const paymentOptions = document.querySelectorAll('.payment-option');

// Добавляем обработчики событий для выбора варианта оплаты
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Убираем класс "selected" у всех вариантов оплаты
        paymentOptions.forEach(o => o.classList.remove('selected'));
        // Добавляем класс "selected" к выбранному варианту оплаты
        option.classList.add('selected');
        // Устанавливаем цвет кнопки "Далее" для выбранного варианта оплаты
        nextButton.style.backgroundColor = '#007bff';
        nextButton.style.color = '#fff';
    });
});

// Отправка данных в бот
const sendDataToBot = () => {
    const dataToSend = {
        server: selectedServer.textContent.replace('Выбранный сервер: ', ''),
        plan: document.querySelector('.selected-plan').textContent.replace('Выбранный план: ', ''),
        payment: document.querySelector('.selected-payment').textContent.replace('Выбранный способ оплаты: ', '')
    };

    Telegram.WebApp.sendData(JSON.stringify(dataToSend));
};

// Обработка данных, полученных от бота
Telegram.WebApp.onEvent('data', (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.url) {
        // Отображение ссылки на оплату
        document.getElementById('paymentLink').href = parsedData.url;
        document.getElementById('paymentLink').textContent = "Перейти к оплате";
        document.getElementById('paymentLinkContainer').style.display = 'block';
    }
});

// Обработчик события для кнопки "Отправить данные в бот"
sendDataBtn.addEventListener('click', sendDataToBot);
