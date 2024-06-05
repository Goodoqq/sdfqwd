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

        const selectedPlanElement = document.querySelector('.plan.selected .name');
        const selectedPlan = selectedPlanElement ? selectedPlanElement.textContent : '';

        // Активируем кнопку "Далее"
        nextButton.disabled = false;
        // Устанавливаем цвет кнопки "Далее" для выбранного плана
        nextButton.style.backgroundColor = '#007bff';
        nextButton.style.color = '#fff';

        if (selectedPlan === '5 дней') {
            // Пропускаем шаг оплаты
            nextButton.click();
        }
    });
});

// Обработчик события для кнопки "Далее"
nextButton.addEventListener('click', () => {
    const selectedPlanElement = document.querySelector('.plan.selected .name');
    const selectedPlan = selectedPlanElement ? selectedPlanElement.textContent : '';

    if (currentStep === 0) {
        planBlock.style.display = 'none';
        paymentBlock.style.display = 'block';
        subscriptionTitle.textContent = 'Варианты оплаты';
        currentStep++;
        steps[currentStep].classList.add('active');
        document.querySelectorAll('.step-icon')[currentStep].innerHTML = '<i class="fas fa-check-circle"></i>';

        if (selectedPlan === '5 дней') {
            nextButton.click();
        }
    } else if (currentStep === 1) {
        const selectedPaymentOption = document.querySelector('.payment-option.selected');
        if (selectedPaymentOption) {
            planBlock.style.display = 'none';
            paymentBlock.style.display = 'none';

            if (selectedPlan === '5 дней') {
                handleFreeplan(selectedPlan);
            } else {
                handlePaidPlan(selectedPlan, selectedPaymentOption);
            }

            currentStep++;
            steps[currentStep].classList.add('active');
            document.querySelectorAll('.step-icon')[currentStep].innerHTML = '<i class="fas fa-check-circle"></i>';
            nextButton.textContent = 'Перейти к оплате';
            nextButton.style.display = 'none';
            sendDataBtn.style.display = 'block';
        } else {
            alert('Пожалуйста, выберите способ оплаты');
        }
    }
});

function handleFreeplan(selectedPlan) {
    selectedServer.textContent = 'Выбранный сервер: ' + localStorage.getItem('selectedServer');
    const selectedPlanField = document.querySelector('.selected-plan');
    selectedPlanField.textContent = 'Выбранный план: ' + selectedPlan;

    selectedOptions.style.display = 'block';
    document.querySelector('.selected-payment').style.display = 'none';
    subscriptionTitle.textContent = 'Все верно?';
    nextButton.textContent = 'Получить доступ';
}

function handlePaidPlan(selectedPlan, selectedPaymentOption) {
    const selectedPlanField = document.querySelector('.selected-plan');
    const selectedPaymentField = document.querySelector('.selected-payment');
    selectedServer.textContent = 'Выбранный сервер: ' + localStorage.getItem('selectedServer');
    selectedPlanField.textContent = 'Выбранный план: ' + selectedPlan;
    selectedPaymentField.textContent = 'Выбранный способ оплаты: ' + selectedPaymentOption.querySelector('.name').textContent;
    selectedOptions.style.display = 'block';
    subscriptionTitle.textContent = 'Все верно?';
}

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

// Функция для отправки данных в Telegram-бот
const sendDataToBot = () => {
    const server = selectedServer.textContent.replace('Выбранный сервер: ', '');
    const plan = document.querySelector('.selected-plan').textContent.replace('Выбранный план: ', '');
    const paymentField = document.querySelector('.selected-payment');
    const payment = paymentField ? paymentField.textContent.replace('Выбранный способ оплаты: ', '') : '';

    const dataToSend = {
        server,
        plan,
        payment
    };

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.telegram.org/bot5797908031:AAEZGcttLY2rBbm-3jQxGZic8HJ2rANUQMU/sendData', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.result && response.result.pay_link) {
                const payLink = response.result.pay_link;
                document.getElementById('payLink').innerHTML = `<a href="${payLink}" target="_blank">Оплатить</a>`;
            }
        }
    };
    xhr.send(JSON.stringify(dataToSend));
};

// Обработчик события для кнопки "Отправить данные в бот"
sendDataBtn.addEventListener('click', sendDataToBot);
