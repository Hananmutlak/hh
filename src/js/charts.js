import Chart from 'chart.js/auto';

// دالة لإنشاء المخططات
export function renderCharts() {
    const mainChartCanvas = document.getElementById('mainChart');
    const pieChartCanvas = document.getElementById('pieChart');
    
    // التحقق من وجود العناصر الأساسية
    if (!mainChartCanvas || !pieChartCanvas) {
        console.error('Canvas elements not found!');
        return;
    }

    let mainChart, pieChart;

    // دالة لإنشاء المخططات
    const createCharts = (cases, deaths, recovered) => {
        // تدمير الرسوم البيانية القديمة إذا وجدت
        if (mainChart) mainChart.destroy();
        if (pieChart) pieChart.destroy();

        // إنشاء الرسم البياني الرئيسي (العامودي)
        mainChart = new Chart(mainChartCanvas, {
            type: 'bar',
            data: {
                labels: ['Cases', 'Deaths', 'Recovered'],
                datasets: [{
                    label: 'Statistics',
                    data: [cases, deaths, recovered],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        // إنشاء الرسم الدائري (Pie Chart)
        pieChart = new Chart(pieChartCanvas, {
            type: 'pie',
            data: {
                labels: ['Active', 'Deaths', 'Recovered'],
                datasets: [{
                    data: [cases - deaths - recovered, deaths, recovered],
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#4BC0C0'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    };

    // دالة لجلب البيانات من الـ API
    const fetchData = async (disease) => {
        try {
            let data;
            if (disease === 'covid') {
                const res = await fetch('https://disease.sh/v3/covid-19/all');
                data = await res.json();
                createCharts(data.cases, data.deaths, data.recovered);
            } else if (disease === 'flu') {
                createCharts(1000000, 5000, 950000);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // التحقق من وجود عنصر الاختيار (دروب داون) قبل إضافة الحدث
    const diseaseSelect = document.getElementById('diseaseSelect');
    if (diseaseSelect) {
        diseaseSelect.addEventListener('change', (e) => {
            fetchData(e.target.value);
        });
    }

    // تحميل البيانات الأولية
    fetchData('covid');
}
