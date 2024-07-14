window.addEventListener('DOMContentLoaded', (event) => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;
    const TST_Uid = '398119882';
    document.getElementById('username').textContent ='user.first_name';
    document.getElementById('userid').textContent = 'user.id';

    // Подключаем axios
    const axios = window.axios;

    // Функция для запроса данных из AppSheet и отображения в компактных элементах
    async function fetchAppSheetData() {
        const apiUrl = 'https://api.appsheet.com/api/v2/apps/9b63e70e-415c-4194-bcb2-8b660487f818/tables/Планування/Action';
        const apiKey = 'V2-SvmY9-btgoD-NhsQX-WZVcy-2izI3-qhS9D-feVkP-6bexN';

        const requestData = {
            "Action": "Find",
            "Properties": {
                "Locale": "en-US",
                "Location": "47.623098, -122.330184",
                "Selector": `Filter(Планування, [Водій_TGid] = ${TST_Uid})`,
                "Timezone": "Pacific Standard Time",
                "UserSettings": {
                    "Option 1": "value1",
                    "Option 2": "value2"
                }
            },
            "Rows": []
        };

        try {
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
                    button.textContent = `Запись ${index + 1}`;
                    cardHeader.appendChild(button);

                    const collapse = document.createElement('div');
                    collapse.id = `collapse${index}`;
                    collapse.classList.add('collapse');
                    collapse.setAttribute('aria-labelledby', `heading${index}`);
                    collapse.setAttribute('data-parent', '.accordion');

                    const cardBody = document.createElement('div');
                    cardBody.classList.add('card-body');

                    for (const key in rowData) {
                        if (rowData.hasOwnProperty(key)) {
                            const p = document.createElement('p');
                            p.textContent = `${key}: ${rowData[key]}`;
                            cardBody.appendChild(p);
                        }
                    }

                    collapse.appendChild(cardBody);
                    card.appendChild(cardHeader);
                    card.appendChild(collapse);
                    accordion.appendChild(card);
                });

                const container = document.querySelector('.container');
                container.innerHTML = ''; // Очистка контейнера
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
    }

    // Вызов функции для получения данных из AppSheet
    fetchAppSheetData();
});
