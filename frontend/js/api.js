/**
 * API Service for HRMS Lite
 * Handles all API communications with the Django backend
 */

const API = {
    /**
     * Generic fetch wrapper with error handling
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.error?.message || data.error || 'An error occurred',
                    details: data
                };
            }

            return data;
        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 500,
                message: 'Network error. Please check your connection and try again.',
                details: error.message
            };
        }
    },

    /**
     * Dashboard API
     */
    dashboard: {
        async getStats() {
            return await API.request('/dashboard/');
        }
    },

    /**
     * Employee API
     */
    employees: {
        async getAll() {
            return await API.request('/employees/');
        },

        async getById(id) {
            return await API.request(`/employees/${id}/`);
        },

        async create(employeeData) {
            return await API.request('/employees/', {
                method: 'POST',
                body: JSON.stringify(employeeData)
            });
        },

        async update(id, employeeData) {
            return await API.request(`/employees/${id}/`, {
                method: 'PUT',
                body: JSON.stringify(employeeData)
            });
        },

        async delete(id) {
            return await API.request(`/employees/${id}/`, {
                method: 'DELETE'
            });
        },

        async getStats(employeeId) {
            return await API.request(`/employees/${employeeId}/stats/`);
        }
    },

    /**
     * Attendance API
     */
    attendance: {
        async getAll(filters = {}) {
            const params = new URLSearchParams();

            if (filters.employee_id) {
                params.append('employee_id', filters.employee_id);
            }
            if (filters.date) {
                params.append('date', filters.date);
            }
            if (filters.status) {
                params.append('status', filters.status);
            }

            const queryString = params.toString();
            const endpoint = queryString ? `/attendance/?${queryString}` : '/attendance/';

            return await API.request(endpoint);
        },

        async getById(id) {
            return await API.request(`/attendance/${id}/`);
        },

        async create(attendanceData) {
            return await API.request('/attendance/', {
                method: 'POST',
                body: JSON.stringify(attendanceData)
            });
        },

        async update(id, attendanceData) {
            return await API.request(`/attendance/${id}/`, {
                method: 'PUT',
                body: JSON.stringify(attendanceData)
            });
        },

        async delete(id) {
            return await API.request(`/attendance/${id}/`, {
                method: 'DELETE'
            });
        }
    }
};
