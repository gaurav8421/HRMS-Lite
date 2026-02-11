/**
 * Dashboard JavaScript for HRMS Lite
 */

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();

    // Set today's date in the form
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = Utils.getTodayDate();
    }
});

/**
 * Load dashboard data
 */
async function loadDashboard() {
    try {
        const response = await API.dashboard.getStats();

        if (response.success) {
            renderStats(response.data);
            renderRecentAttendance(response.data.recent_attendance);
        }
    } catch (error) {
        console.error('Failed to load dashboard:', error);
        document.getElementById('statsGrid').innerHTML = `
            <div class="card">
                <div class="alert alert-danger">
                    ❌ Failed to load dashboard data. Please make sure the backend server is running.
                </div>
            </div>
        `;
    }
}

/**
 * Render statistics cards
 */
function renderStats(data) {
    const statsGrid = document.getElementById('statsGrid');

    const stats = [
        {
            icon: '👥',
            label: 'Total Employees',
            value: data.total_employees || 0,
            class: 'primary'
        },
        {
            icon: '✅',
            label: 'Present Today',
            value: data.present_today || 0,
            class: 'success'
        },
        {
            icon: '❌',
            label: 'Absent Today',
            value: data.absent_today || 0,
            class: 'danger'
        },
        {
            icon: '📊',
            label: 'Attendance Rate',
            value: `${data.attendance_rate || 0}%`,
            class: 'warning'
        }
    ];

    const statsHTML = stats.map(stat => `
        <div class="stat-card ${stat.class}">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
        </div>
    `).join('');

    statsGrid.innerHTML = statsHTML;
}

/**
 * Render recent attendance table
 */
function renderRecentAttendance(attendances) {
    const container = document.getElementById('recentAttendanceContainer');

    if (!attendances || attendances.length === 0) {
        Utils.showEmpty(
            container,
            'No Attendance Records',
            'No recent attendance records found. Start marking attendance!',
            '📋'
        );
        return;
    }

    const tableHTML = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Employee Name</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Marked On</th>
                    </tr>
                </thead>
                <tbody>
                    ${attendances.map(attendance => `
                        <tr>
                            <td><strong>${Utils.escapeHtml(attendance.employee_emp_id)}</strong></td>
                            <td>${Utils.escapeHtml(attendance.employee_name)}</td>
                            <td>${Utils.formatDate(attendance.date)}</td>
                            <td>
                                <span class="badge badge-${attendance.status === 'Present' ? 'success' : 'danger'}">
                                    ${attendance.status === 'Present' ? '✅' : '❌'} ${attendance.status}
                                </span>
                            </td>
                            <td>${Utils.formatDateTime(attendance.created_at)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}
