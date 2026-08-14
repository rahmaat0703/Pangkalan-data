// Global functions dan utilities

// Format tanggal Indonesia
function formatTanggal(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Format tanggal dan waktu
function formatTanggalWaktu(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Format waktu
function formatWaktu(timeString) {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
}

// Show alert
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const container = document.querySelector('.container') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Get badge class berdasarkan status
function getStatusBadgeClass(status) {
    switch(status) {
        case 'Menunggu':
            return 'bg-warning';
        case 'Diproses':
        case 'Disetujui':
            return 'bg-info';
        case 'Selesai':
            return 'bg-success';
        case 'Ditolak':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

// Check authentication
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (data.success) {
            return data.user;
        }
        return null;
    } catch (error) {
        console.error('Error checking auth:', error);
        return null;
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/login';
        }
    } catch (error) {
        console.error('Error logging out:', error);
        showAlert('Gagal logout', 'danger');
    }
}

// Load user info untuk navbar
async function loadUserInfo() {
    const user = await checkAuth();
    
    if (user) {
        const userInfoElement = document.getElementById('userInfo');
        if (userInfoElement) {
            userInfoElement.innerHTML = `
                <span class="me-3">Halo, ${user.nama}</span>
                <button class="btn btn-outline-light btn-sm" onclick="logout()">Logout</button>
            `;
        }
    }
}

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
});

// Confirm delete
function confirmDelete(message = 'Apakah Anda yakin ingin menghapus data ini?') {
    return confirm(message);
}

// Format number dengan separator
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Validasi email
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validasi nomor telepon
function isValidPhone(phone) {
    const re = /^[0-9]{10,13}$/;
    return re.test(phone);
}

// Auto-hide alerts
document.addEventListener('DOMContentLoaded', function() {
    const alerts = document.querySelectorAll('.alert:not(.alert-permanent)');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });
});