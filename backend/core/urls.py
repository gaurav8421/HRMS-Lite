"""
URL configuration for core app API endpoints
"""
from django.urls import path
from .views import (
    EmployeeListCreateView,
    EmployeeDetailView,
    AttendanceListCreateView,
    AttendanceDetailView,
    EmployeeAttendanceStatsView,
    DashboardStatsView
)

urlpatterns = [
    # Dashboard
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),

    # Employee endpoints
    path('employees/', EmployeeListCreateView.as_view(), name='employee-list-create'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('employees/<str:employee_id>/stats/', EmployeeAttendanceStatsView.as_view(), name='employee-stats'),

    # Attendance endpoints
    path('attendance/', AttendanceListCreateView.as_view(), name='attendance-list-create'),
    path('attendance/<int:pk>/', AttendanceDetailView.as_view(), name='attendance-detail'),
]
