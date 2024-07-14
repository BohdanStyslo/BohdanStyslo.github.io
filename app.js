let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';


let p = document.createElement("p");
p.innerText = `${tg.initDataUnsafe.user.first_name}
${tg.initDataUnsafe.user.last_name}
${tg.initDataUnsafe.user.id}`;

usercard.appendChild(p);



document.addEventListener('DOMContentLoaded', fetchData);

        async function fetchData() {
            const driverId = 2; // Фіксоване значення Driver_Id
            const url = `https://script.google.com/macros/s/AKfycbweJYaSCuMrDDnNEWJqF9LRHyQ7JaOnjbY5Fh1QfF1CYJ9EoZLZ_PUlV08Te6Z83jhk/exec?Driver_id=${driverId}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const data = await response.json();
                console.log('Fetched Data:', data);
                buildTable(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        function buildTable(data) {
            const tableHeader = document.getElementById('tableHeader');
            const tableBody = document.getElementById('tableBody');

            tableHeader.innerHTML = '';
            tableBody.innerHTML = '';

            if (data.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="17">No records found</td></tr>';
                return;
            }

            // Create header row
            const headers = Object.keys(data[0]);
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                tableHeader.appendChild(th);
            });

            // Create body rows
            data.forEach(row => {
                const tr = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = row[header];
                    tr.appendChild(td);
                });
                tableBody.appendChild(tr);
            });
        }




  // Функция для запроса данных из AppSheet
    async function fetchAppSheetData() {
        const apiUrl = 'https://api.appsheet.com/api/v2/apps/c886f36a-45a4-496d-8790-b02bb64a3653/tables/Verification/Action';
        const apiKey = apiToken;
        const num = number; // Измените на нужное значение

        const requestData = {
            "Action": "Find",
            "Properties": {
                "Locale": "en-US",
                "Location": "47.623098, -122.330184",
                "Selector": `Filter('Verification', [Number] = '36627007/100074-24')`,
                "Timezone": "Pacific Standard Time",
                "UserSettings": {
                    "Option 1": "value1",
                    "Option 2": "value2"
                }
            },
            "Rows": []
        };

        try {
            const response = await fetch(`${apiUrl}?applicationAccessKey=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

Logger.log(response);


            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();
            const value = data.Rows[0].YourColumnName; // Измените на имя вашей колонки
            document.getElementById('appsheet-value').textContent = value;
        } catch (error) {
            console.error('Ошибка при запросе данных из AppSheet:', error);
        }
    }
