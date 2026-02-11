"""
API Views for HRMS Lite
"""
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q

from .models import Employee, Attendance
from .serializers import (
    EmployeeSerializer,
    AttendanceSerializer,
    DashboardStatsSerializer
)


class EmployeeListCreateView(APIView):
    """
    API endpoint for listing and creating employees
    GET: List all employees
    POST: Create a new employee
    """

    def get(self, request):
        """Get all employees"""
        try:
            employees = Employee.objects.all()
            serializer = EmployeeSerializer(employees, many=True)

            return Response({
                'success': True,
                'data': serializer.data,
                'count': employees.count()
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'message': 'Failed to fetch employees.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """Create a new employee"""
        try:
            serializer = EmployeeSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Employee created successfully.',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)

            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'message': 'Failed to create employee.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class EmployeeDetailView(APIView):
    """
    API endpoint for employee detail operations
    GET: Retrieve a specific employee
    PUT: Update a specific employee
    DELETE: Delete a specific employee
    """

    def get_object(self, pk):
        """Helper method to get employee by ID"""
        try:
            return Employee.objects.get(pk=pk)
        except Employee.DoesNotExist:
            return None

    def get(self, request, pk):
        """Get employee by ID"""
        employee = self.get_object(pk)

        if not employee:
            return Response({
                'success': False,
                'error': {
                    'message': 'Employee not found.'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = EmployeeSerializer(employee)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update employee"""
        employee = self.get_object(pk)

        if not employee:
            return Response({
                'success': False,
                'error': {
                    'message': 'Employee not found.'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = EmployeeSerializer(employee, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Employee updated successfully.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete employee"""
        employee = self.get_object(pk)

        if not employee:
            return Response({
                'success': False,
                'error': {
                    'message': 'Employee not found.'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        employee_id = employee.employee_id
        employee.delete()

        return Response({
            'success': True,
            'message': f'Employee {employee_id} deleted successfully.'
        }, status=status.HTTP_200_OK)


class AttendanceListCreateView(APIView):
    """
    API endpoint for listing and creating attendance records
    GET: List attendance (with optional filters)
    POST: Create a new attendance record
    """

    def get(self, request):
        """Get attendance records with optional filters"""
        try:
            attendances = Attendance.objects.select_related('employee').all()

            # Filter by employee_id if provided
            employee_id = request.query_params.get('employee_id')
            if employee_id:
                attendances = attendances.filter(employee__employee_id=employee_id.upper())

            # Filter by date if provided
            date = request.query_params.get('date')
            if date:
                attendances = attendances.filter(date=date)

            # Filter by status if provided
            status_filter = request.query_params.get('status')
            if status_filter:
                attendances = attendances.filter(status=status_filter)

            serializer = AttendanceSerializer(attendances, many=True)

            return Response({
                'success': True,
                'data': serializer.data,
                'count': attendances.count()
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'message': 'Failed to fetch attendance records.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """Create a new attendance record"""
        try:
            serializer = AttendanceSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Attendance marked successfully.',
                    'data': serializer.data
                }, status=status.HTTP_201_CREATED)

            return Response({
                'success': False,
                'error': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'message': 'Failed to mark attendance.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class AttendanceDetailView(APIView):
    """
    API endpoint for attendance detail operations
    GET: Retrieve a specific attendance record
    PUT: Update a specific attendance record
    DELETE: Delete a specific attendance record
    """

    def get_object(self, pk):
        """Helper method to get attendance by ID"""
        try:
            return Attendance.objects.select_related('employee').get(pk=pk)
        except Attendance.DoesNotExist:
            return None

    def get(self, request, pk):
        """Get attendance by ID"""
        attendance = self.get_object(pk)

        if not attendance:
            return Response({
                'success': False,
                'error': {
                    'message': 'Attendance record not found.'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AttendanceSerializer(attendance)
        return Response({
            'success': True,
            'data': serializer.data
        }, status=status.HTTP_200_OK)

    def put(self, request, pk):
        """Update attendance"""
        attendance = self.get_object(pk)

        if not attendance:
            return Response({
                'success': False,
                'error': {
                    'message': 'Attendance record not found.'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        serializer = AttendanceSerializer(attendance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Attendance updated successfully.',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        return Response({
            'success': False,
            'error': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        """Delete attendance"""
        attendance = self.get_object(pk)

        if not attendance:
            return Response({
                'success': False,
                'error': {
                    'message': 'Attendance record not found.'
                }
            }, status=status.HTTP_404_NOT_FOUND)

        attendance.delete()

        return Response({
            'success': True,
            'message': 'Attendance record deleted successfully.'
        }, status=status.HTTP_200_OK)


class EmployeeAttendanceStatsView(APIView):
    """
    API endpoint for employee attendance statistics
    GET: Get attendance stats for a specific employee
    """

    def get(self, request, employee_id):
        """Get attendance statistics for an employee"""
        try:
            # Get employee
            try:
                employee = Employee.objects.get(employee_id=employee_id.upper())
            except Employee.DoesNotExist:
                return Response({
                    'success': False,
                    'error': {
                        'message': f'Employee with ID {employee_id} not found.'
                    }
                }, status=status.HTTP_404_NOT_FOUND)

            # Get attendance records
            attendances = Attendance.objects.filter(employee=employee)

            # Calculate statistics
            total_days = attendances.count()
            present_days = attendances.filter(status='Present').count()
            absent_days = attendances.filter(status='Absent').count()
            attendance_rate = (present_days / total_days * 100) if total_days > 0 else 0

            return Response({
                'success': True,
                'data': {
                    'employee_id': employee.employee_id,
                    'employee_name': employee.full_name,
                    'total_days': total_days,
                    'present_days': present_days,
                    'absent_days': absent_days,
                    'attendance_rate': round(attendance_rate, 2)
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'message': 'Failed to fetch attendance statistics.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DashboardStatsView(APIView):
    """
    API endpoint for dashboard statistics
    GET: Get overall system statistics
    """

    def get(self, request):
        """Get dashboard statistics"""
        try:
            today = timezone.now().date()

            # Total employees
            total_employees = Employee.objects.count()

            # Today's attendance
            today_attendance = Attendance.objects.filter(date=today)
            present_today = today_attendance.filter(status='Present').count()
            absent_today = today_attendance.filter(status='Absent').count()

            # Calculate attendance rate
            attendance_rate = (present_today / total_employees * 100) if total_employees > 0 else 0

            # Get recent attendance records
            recent_attendance = Attendance.objects.select_related('employee').order_by('-date', '-created_at')[:10]
            recent_serializer = AttendanceSerializer(recent_attendance, many=True)

            return Response({
                'success': True,
                'data': {
                    'total_employees': total_employees,
                    'present_today': present_today,
                    'absent_today': absent_today,
                    'attendance_rate': round(attendance_rate, 2),
                    'today_date': str(today),
                    'recent_attendance': recent_serializer.data
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'success': False,
                'error': {
                    'message': 'Failed to fetch dashboard statistics.',
                    'details': str(e)
                }
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
