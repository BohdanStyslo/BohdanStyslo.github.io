window.addEventListener('DOMContentLoaded', (event) => {
    const tg = window.Telegram.WebApp;
    const user = tg.initDataUnsafe.user;
    const TST_Uid = '398119882';
    document.getElementById('username').textContent = user.first_name;
    document.getElementById('userid').textContent = user.id;

    // Подключаем axios
    const axios = window.axios;

    // Функция для запроса данных из AppSheet
    async function fetchAppSheetData() {
        const apiUrl = 'https://api.appsheet.com/api/v2/apps/9b63e70e-415c-4194-bcb2-8b660487f818/tables/Планування/Action';
        const apiKey = 'V2-SvmY9-btgoD-NhsQX-WZVcy-2izI3-qhS9D-feVkP-6bexN';
       

        const requestData = {
            "Action": "Find",
            "Properties": {
                "Locale": "en-US",
                "Location": "47.623098, -122.330184",
                "Selector": `Filter(Планування, [Водій_TGid] = ${user.id})`,
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

  console.log(data);

            if (data && data.length > 0) {
                // Генерация HTML для таблицы
                const table = document.createElement('table');
                table.classList.add('appsheet-table');

                // Создание заголовка таблицы
                const headerRow = document.createElement('tr');
                for (const key in data[0]) {
                    if (data[0].hasOwnProperty(key)) {
                        const th = document.createElement('th');
                        th.textContent = key;
                        headerRow.appendChild(th);
                    }
                }
                table.appendChild(headerRow);

                // Создание строк данных
                data.forEach(rowData => {
                    const row = document.createElement('tr');
                    for (const key in rowData) {
                        if (rowData.hasOwnProperty(key)) {
                            const cell = document.createElement('td');
                            cell.textContent = rowData[key];
                            row.appendChild(cell);
                        }
                    }
                    table.appendChild(row);
                });

                // Очистка контейнера и добавление таблицы
                const container = document.querySelector('.container');
                container.innerHTML = ''; // Очистка контейнера
                container.appendChild(table);
            } else {
                // Если данных нет
                const noDataMessage = document.createElement('p');
                noDataMessage.textContent = 'Нет данных для отображения';
                document.getElementById('appsheet-value').appendChild(noDataMessage);
            }
        } catch (error) {
            console.error('Ошибка при запросе данных из AppSheet:', error);
        }
    }

    // Вызов функции для получения данных из AppSheet
    fetchAppSheetData();
});
