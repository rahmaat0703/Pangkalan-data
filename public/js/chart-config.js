// Konfigurasi Chart.js untuk grafik konsultasi

// Fungsi untuk membuat Bar Chart
function createBarChart(canvasId, labels, data, colors) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Jumlah Konsultasi',
                data: data,
                backgroundColor: colors,
                borderColor: colors.map(c => c.replace('0.8', '1')),
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 13,
                            weight: 'bold'
                        },
                        padding: 15
                    }
                },
                title: {
                    display: true,
                    text: 'Statistik Konsultasi Berdasarkan Keperluan',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10
                        },
                        maxRotation: 45,
                        minRotation: 45
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Fungsi untuk membuat Doughnut Chart
function createDoughnutChart(canvasId, labels, data, colors) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                label: 'Konsultasi',
                data: data,
                backgroundColor: colors,
                borderColor: '#ffffff',
                borderWidth: 3,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        font: {
                            size: 11
                        },
                        padding: 12,
                        boxWidth: 15,
                        generateLabels: function(chart) {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                    const percentage = ((value / total) * 100).toFixed(1);
                                    
                                    return {
                                        text: `${label} (${percentage}%)`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Proporsi Keperluan Konsultasi',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Fungsi untuk load data dan buat chart
async function loadAndCreateCharts() {
    try {
        const response = await fetch('/api/pengunjung/statistik-konsultasi');
        const result = await response.json();
        
        if (result.success) {
            const { labels, values, colors } = result.data;
            
            // Buat warna dengan opacity untuk aesthetic
            const barColors = colors.map(c => c + 'CC'); // Tambah opacity
            const doughnutColors = [
                'rgba(59, 130, 246, 0.85)',   // Blue
                'rgba(16, 185, 129, 0.85)',   // Green
                'rgba(239, 68, 68, 0.85)',    // Red
                'rgba(251, 146, 60, 0.85)',   // Orange
                'rgba(139, 92, 246, 0.85)',   // Purple
                'rgba(6, 182, 212, 0.85)',    // Cyan
                'rgba(236, 72, 153, 0.85)'    // Pink
            ];
            
            // Buat Bar Chart
            if (document.getElementById('barChart')) {
                createBarChart('barChart', labels, values, barColors);
            }
            
            // Buat Doughnut Chart
            if (document.getElementById('doughnutChart')) {
                createDoughnutChart('doughnutChart', labels, values, doughnutColors);
            }
        }
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Load charts saat halaman dimuat
if (document.getElementById('barChart') || document.getElementById('doughnutChart')) {
    loadAndCreateCharts();
}