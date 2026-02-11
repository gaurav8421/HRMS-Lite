/**
 * Employees JavaScript for HRMS Lite
 */

// Initialize employees page when loaded
document.addEventListener('DOMContentLoaded', () => {
    loadEmployees();
    setupEmployeeForm();
});

/**
 * Load all employees
 */
async function loadEmployees() {
    const container = document.getElementById('employeeListContainer');
    Utils.showLoading(container, 'Loading employees...');

    try {
        const response = await API.employees.getAll();

        if (response.success) {
            updateEmployeeCount(response.count);
            renderEmployees(response.data);
        }
    } catch (error) {
        console.error('Failed to load employees:', error);
        container.innerHTML = `
            <div class="alert alert-danger">
                ❌ Failed to load employees. Please make sure the backend server is running.
            </div>
        `;
    }
}

/**
 * Update employee count badge
 */
function updateEmployeeCount(count) {
    const badge = document.getElementById('employeeCount');
    if (badge) {
        badge.textContent = `${count} Employee${count !== 1 ? 's' : ''}`;
    }
}

/**
 * Render employees table
 */
function renderEmployees(employees) {
    const container = document.getElementById('employeeListContainer');

    if (!employees || employees.length === 0) {
        Utils.showEmpty(
            container,
            'No Employees Found',
            'Start by adding your first employee using the form above.',
            '👥'
        );
        return;
    }

    const tableHTML = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${employees.map(employee => `
                        <tr>
                            <td><strong>${Utils.escapeHtml(employee.employee_id)}</strong></td>
                            <td>${Utils.escapeHtml(employee.full_name)}</td>
                            <td>${Utils.escapeHtml(employee.email)}</td>
                            <td>
                                <span class="badge badge-primary">
                                    ${Utils.escapeHtml(employee.department)}
                                </span>
                            </td>
                            <td>${Utils.formatDate(employee.created_at)}</td>
                            <td>
                                <div class="action-buttons">
                                    <button
                                        class="btn-icon btn-delete"
                                        onclick="deleteEmployee(${employee.id}, '${Utils.escapeHtml(employee.employee_id)}')"
                                        title="Delete Employee"
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
 * Setup employee form submission
 */
function setupEmployeeForm() {
    const form = document.getElementById('addEmployeeForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const formData = Utils.getFormData(form);

        // Validate email
        if (!Utils.isValidEmail(formData.email)) {
            Utils.showAlert('Please enter a valid email address.', 'error');
            return;
        }

        // Validate required fields
        if (!formData.employee_id || !formData.full_name || !formData.email || !formData.department) {
            Utils.showAlert('Please fill in all required fields.', 'error');
            return;
        }

        Utils.disableButton(submitBtn, 'Adding Employee...');

        try {
            const response = await API.employees.create(formData);

            if (response.success) {
                Utils.showAlert('Employee added successfully!', 'success');
                Utils.resetForm(form);
                loadEmployees();
                Utils.scrollToTop();
            }
        } catch (error) {
            console.error('Failed to add employee:', error);
            Utils.showError(error);
        } finally {
            Utils.enableButton(submitBtn);
        }
    });
}

/**
 * Delete employee
 */
async function deleteEmployee(id, employeeId) {
    if (!Utils.confirm(`Are you sure you want to delete employee ${employeeId}?\n\nThis action cannot be undone and will also delete all attendance records for this employee.`)) {
        return;
    }

    try {
        const response = await API.employees.delete(id);

        if (response.success) {
            Utils.showAlert(response.message || 'Employee deleted successfully!', 'success');
            loadEmployees();
        }
    } catch (error) {
        console.error('Failed to delete employee:', error);
        Utils.showError(error);
    }
}
