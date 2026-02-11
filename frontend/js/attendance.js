/**
 * Attendance JavaScript for HRMS Lite
 */

// Store current filters
let currentFilters = {};

// Initialize attendance page when loaded
document.addEventListener('DOMContentLoaded', () => {
    loadAttendance();
    setupAttendanceForm();
    setupFilters();

    // Set today's date in the form
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = Utils.getTodayDate();
    }
});

/**
 * Load all attendance records
 */
async function loadAttendance(filters = {}) {
    const container = document.getElementById('attendanceListContainer');
    Utils.showLoading(container, 'Loading attendance records...');

    try {
        const response = await API.attendance.getAll(filters);

        if (response.success) {
            updateAttendanceCount(response.count);
            renderAttendance(response.data);
        }
    } catch (error) {
        console.error('Failed to load attendance:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                ❌ Failed to load attendance records. Please make sure the backend server is running.
            </div>
        `;
    }
}

/**
 * Update attendance count badge
 */
function updateAttendanceCount(count) {
    const badge = document.getElementById('attendanceCount');
    if (badge) {
        badge.textContent = `${count} Record${count !== 1 ? 's' : ''}`;
    }
}

/**
 * Render attendance table
 */
function renderAttendance(attendances) {
    const container = document.getElementById('attendanceListContainer');

    if (!attendances || attendances.length === 0) {
        Utils.showEmpty(
            container,
            'No Attendance Records',
            'No attendance records match your filters. Try adjusting your search criteria or mark new attendance.',
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
                        <th>Actions</th>
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
                            <td>
                                <div class="action-buttons">
                                    <button
                                        class="btn-icon btn-delete"
                                        onclick="deleteAttendance(${attendance.id})"
                                        title="Delete Attendance"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    container.innerHTML = tableHTML;
}

/**
 * Setup attendance form submission
 */
function setupAttendanceForm() {
    const form = document.getElementById('markAttendanceForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formData = Utils.getFormData(form);

        // Validate required fields
        if (!formData.employee_id || !formData.date || !formData.status) {
            Utils.showAlert('Please fill in all required fields.', 'error');
            return;
        }

        // Validate date is not in future
        const selectedDate = new Date(formData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate > today) {
            Utils.showAlert('Cannot mark attendance for future dates.', 'error');
            return;
        }

        Utils.disableButton(submitBtn, 'Marking Attendance...');

        try {
            const response = await API.attendance.create(formData);

            if (response.success) {
                Utils.showAlert('Attendance marked successfully!', 'success');
                Utils.resetForm(form);

                // Reset date to today
                const dateInput = document.getElementById('date');
                if (dateInput) {
                    dateInput.value = Utils.getTodayDate();
                }

                loadAttendance(currentFilters);
                Utils.scrollToTop();
            }
        } catch (error) {
            console.error('Failed to mark attendance:', error);
            Utils.showError(error);
        } finally {
            Utils.enableButton(submitBtn);
        }
    });
}

/**
 * Setup filter functionality
 */
function setupFilters() {
    const applyBtn = document.getElementById('applyFilterBtn');
    const clearBtn = document.getElementById('clearFilterBtn');

    if (applyBtn) {
        applyBtn.addEventListener('click', applyFilters);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearFilters);
    }

    // Add Enter key support for filter inputs
    const filterInputs = ['filterEmployeeId', 'filterDate', 'filterStatus'];
    filterInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    applyFilters();
                }
            });
        }
    });
}

/**
 * Apply filters
 */
function applyFilters() {
    const employeeId = document.getElementById('filterEmployeeId')?.value.trim();
    const date = document.getElementById('filterDate')?.value;
    const status = document.getElementById('filterStatus')?.value;

    currentFilters = {};

    if (employeeId) {
        currentFilters.employee_id = employeeId;
    }
    if (date) {
        currentFilters.date = date;
    }
    if (status) {
        currentFilters.status = status;
    }

    loadAttendance(currentFilters);
}

/**
 * Clear filters
 */
function clearFilters() {
    // Clear filter inputs
    const filterEmployeeId = document.getElementById('filterEmployeeId');
    const filterDate = document.getElementById('filterDate');
    const filterStatus = document.getElementById('filterStatus');

    if (filterEmployeeId) filterEmployeeId.value = '';
    if (filterDate) filterDate.value = '';
    if (filterStatus) filterStatus.value = '';

    // Reset filters
    currentFilters = {};

    // Reload attendance
    loadAttendance();
}

/**
 * Delete attendance record
 */
async function deleteAttendance(id) {
    if (!Utils.confirm('Are you sure you want to delete this attendance record?\n\nThis action cannot be undone.')) {
        return;
    }

    try {
        const response = await API.attendance.delete(id);

        if (response.success) {
            Utils.showAlert(response.message || 'Attendance record deleted successfully!', 'success');
            loadAttendance(currentFilters);
        }
    } catch (error) {
        console.error('Failed to delete attendance:', error);
        Utils.showError(error);
    }
}
