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
