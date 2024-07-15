window.addEventListener('DOMContentLoaded', (event) => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;
    const TST_Uid = '398119882';
    document.getElementById('username').textContent = user.first_name;
    document.getElementById('userid').textContent = user.id;

    // Подключаем axios
    const axios = window.axios;
    const loadingIndicator = document.getElementById('loading-indicator');


    // Функция для запроса данных из AppSheet и отображения в компактных элементах
    async function fetchAppSheetData() {
        const apiUrl = 'https://api.appsheet.com/api/v2/apps/9b63e70e-415c-4194-bcb2-8b660487f818/tables/Планування/Action';
        const apiKey = 'V2-SvmY9-btgoD-NhsQX-WZVcy-2izI3-qhS9D-feVkP-6bexN';

        const requestData = {
            "Action": "Find",
            "Properties": {
                "Locale": "en-US",
                "Location": "47.623098, -122.330184",
                "Selector": `ORDERBY(Filter(Планування, [Водій_TGid] = '${TST_Uid}'), [ID], true)`,
                "Timezone": "Pacific Standard Time",
                "UserSettings": {
                    "Option 1": "value1",
                    "Option 2": "value2"
                }
            },
            "Rows": []
        };

        try {
            loadingIndicator.style.display = 'block'; // Показать индикатор загрузки

            const response = await axios.post(`${apiUrl}?applicationAccessKey=${apiKey}`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = response.data;
            if (data && data.length > 0) {
                const accordion = document.createElement('div');
                accordion.classList.add('accordion');

                data.forEach((rowData, index) => {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const cardHeader = document.createElement('div');
                    cardHeader.classList.add('card-header');
                    cardHeader.id = `heading${index}`;

                    const button = document.createElement('button');
                    button.classList.add('btn', 'btn-link', 'collapsed');
                    button.setAttribute('type', 'button');
                    button.setAttribute('data-toggle', 'collapse');
                    button.setAttribute('data-target', `#collapse${index}`);
                    button.setAttribute('aria-expanded', 'false');
                    button.setAttribute('aria-controls', `collapse${index}`);

                    console.log(rowData);

                    button.textContent = `${rowData.Дата} (${rowData.Період})`; // `Замовлення ${index + 1}`;
                    cardHeader.appendChild(button);

                    const collapse = document.createElement('div');
                    collapse.id = `collapse${index}`;
                    collapse.classList.add('collapse');
                    collapse.setAttribute('aria-labelledby', `heading${index}`);
                    collapse.setAttribute('data-parent', '.accordion');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    /*       for (const key in rowData) {
                                if (rowData.hasOwnProperty(key)) {
                                    const p = document.createElement('p');
                                    p.textContent = `${key}: ${rowData[key]}`;
                                    cardBody.appendChild(p);
                                }
                            }
        */

                    const fieldsToShow = ['Лейбла', `Назва об'єкта`, 'Дата', 'Фірма замовника', 'Статус'];

                    fieldsToShow.forEach(field => {
                        const p = document.createElement('p');
                        p.textContent = `${field}: ${rowData[field]}`;
                        cardBody.appendChild(p);
                    });

                    if (rowData.Статус !== 'Виконано' && rowData.Статус !== 'Водій: виконано') {
                        // Добавление кнопки "Виконано"
                        const doneButton = document.createElement('button');
                        doneButton.classList.add('btn', 'btn-success');
                        doneButton.textContent = 'Виконано';
                        doneButton.addEventListener('click', () => updateStatus(rowData.ID));
                        cardBody.appendChild(doneButton);

                    }



                    collapse.appendChild(cardBody);
                    card.appendChild(cardHeader);
                    card.appendChild(collapse);
                    accordion.appendChild(card);
                });

                const container = document.querySelector('.container');
             //   container.innerHTML = ''; // Очистка контейнера
                container.appendChild(accordion);
            } else {
                // Если данных нет
                const noDataMessage = document.createElement('p');
                noDataMessage.textContent = 'Відсутні дані';
                document.getElementById('appsheet-value').appendChild(noDataMessage);
            }
        } catch (error) {
            console.error('Помилка під час отримання даних з AppSheet:', error);
        }
        finally {
            loadingIndicator.style.display = 'none'; // Скрыть индикатор загрузки
        }
    }




    // Функция для обновления статуса записи в AppSheet
    async function updateStatus(recordId) {
        const apiUrl = 'https://api.appsheet.com/api/v2/apps/9b63e70e-415c-4194-bcb2-8b660487f818/tables/Планування/Action';
        const apiKey = 'V2-SvmY9-btgoD-NhsQX-WZVcy-2izI3-qhS9D-feVkP-6bexN';

        const requestData = {
            "Action": "Edit",
            "Properties": {
                "Locale": "en-US",
                "Location": "47.623098, -122.330184",
                "Timezone": "Pacific Standard Time",
                "UserSettings": {
                    "Option 1": "value1",
                    "Option 2": "value2"
                }
            },
            "Rows": [{
                "ID": recordId,
                "Статус": "Водій: виконано"
            }]
        };

        try {
            loadingIndicator.style.display = 'block'; // Показать индикатор загрузки

            const response = await axios.post(`${apiUrl}?applicationAccessKey=${apiKey}`, requestData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });



            console.log(response);

            if (response.status === 200) {
                alert('Статус успешно обновлен');
                fetchAppSheetData(); // Обновить данные после изменения статуса
            } else {
                alert('Ошибка при обновлении статуса');
            }
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
            alert('Ошибка при обновлении статуса');
        }
        finally {
            loadingIndicator.style.display = 'none'; // Скрыть индикатор загрузки
        }
    }



    // Вызов функции для получения данных из AppSheet
    fetchAppSheetData();
});
