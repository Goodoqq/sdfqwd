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

        let currentStep = 0;

        plans.forEach(plan => {
            plan.addEventListener('click', () => {
                plans.forEach(p => p.classList.remove('selected'));
                plan.classList.add('selected');
                nextButton.disabled = false;
                nextButton.style.backgroundColor = '#007bff';
                nextButton.style.color = '#fff';
            });
        });

        nextButton.addEventListener('click', () => {
            const selectedPlanElement = document.querySelector('.plan.selected .name');
            const selectedPlan = selectedPlanElement ? selectedPlanElement.textContent : '';

            if (currentStep === 0) {
                if (selectedPlan === '5 дней') {
                    planBlock.style.display = 'none';
                    paymentBlock.style.display = 'none';

                    selectedServer.textContent = 'Выбранный сервер: ' + localStorage.getItem('selectedServer');
                    const selectedPlanField = document.querySelector('.selected-plan');
                    selectedPlanField.textContent = 'Выбранный план: ' + selectedPlan;
                    
                    selectedOptions.style.display = 'block';
                    document.querySelector('.selected-payment').style.display = 'none';
                    subscriptionTitle.textContent = 'Все верно?';
                    steps[2].classList.add('active');
                    document.querySelectorAll('.step-icon')[2].innerHTML = '<i class="fas fa-check-circle"></i>';
                    nextButton.textContent = 'Получить доступ';

                    nextButton.style.display = 'none';
                    sendDataBtn.style.display = 'block';
                } else {
                    planBlock.style.display = 'none';
                    paymentBlock.style.display = 'block';
                    subscriptionTitle.textContent = 'Варианты оплаты';
                    currentStep++;
                    steps[currentStep].classList.add('active');
                    document.querySelectorAll('.step-icon')[currentStep].innerHTML = '<i class="fas fa-check-circle"></i>';
                }
            } else if (currentStep === 1) {
                const selectedPaymentOption = document.querySelector('.payment-option.selected');
                if (selectedPaymentOption) {
                    planBlock.style.display = 'none';
                    paymentBlock.style.display = 'none';
                    const selectedPlanField = document.querySelector('.selected-plan');
                    const selectedPaymentField = document.querySelector('.selected-payment');
                    selectedServer.textContent = 'Выбранный сервер: ' + localStorage.getItem('selectedServer');
                    selectedPlanField.textContent = 'Выбранный план: ' + selectedPlan;
                    selectedPaymentField.textContent = 'Выбранный способ оплаты: ' + selectedPaymentOption.querySelector('.name').textContent;
                    selectedOptions.style.display = 'block';
                    subscriptionTitle.textContent = 'Все верно?';
                    steps[2].classList.add('active');
                    document.querySelectorAll('.step-icon')[2].innerHTML = '<i class="fas fa-check-circle"></i>';
                    nextButton.textContent = 'Перейти к оплате';

                    nextButton.style.display = 'none';
                    sendDataBtn.style.display = 'block';
                } else {
                    alert('Пожалуйста, выберите способ оплаты');
                }
            }
        });

        const paymentOptions = document.querySelectorAll('.payment-option');
        paymentOptions.forEach(option => {
            option.addEventListener('click', () => {
                paymentOptions.forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                nextButton.style.backgroundColor = '#007bff';
                nextButton.style.color = '#fff';
            });
        });

        const sendDataToBot = async () => {
            const server = selectedServer.textContent.replace('Выбранный сервер: ', '');
            const plan = document.querySelector('.selected-plan').textContent.replace('Выбранный план: ', '');
            const paymentField = document.querySelector('.selected-payment');
            const payment = paymentField ? paymentField.textContent.replace('Выбранный способ оплаты: ', '') : '';

            const dataToSend = {
                server,
                plan,
                payment
            };

            Telegram.WebApp.sendData(JSON.stringify(dataToSend));

            try {
                const response = await fetch('/payment-url', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });

                const result = await response.json();
                if (result.payment_url) {
                    const iframe = document.createElement('iframe');
                    iframe.src = result.payment_url;
                    iframe.style.width = '100%';
                    iframe.style.height = '100vh';
                    document.body.appendChild(iframe);
                }
            } catch (error) {
                console.error('Ошибка при получении ссылки на оплату:', error);
            }
        };

        sendDataBtn.addEventListener('click', sendDataToBot);
