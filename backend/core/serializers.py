"""
Serializers for HRMS API
"""
from rest_framework import serializers
from .models import Employee, Attendance
from django.utils import timezone


class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for Employee model"""

    class Meta:
        model = Employee
        fields = ['id', 'employee_id', 'full_name', 'email', 'department', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_employee_id(self, value):
        """Validate employee_id format and uniqueness"""
        if not value:
            raise serializers.ValidationError("Employee ID is required.")

        value = value.strip().upper()

        if len(value) < 3:
            raise serializers.ValidationError("Employee ID must be at least 3 characters long.")

        # Check uniqueness (excluding current instance during update)
        instance = self.instance
        if Employee.objects.filter(employee_id=value).exclude(pk=instance.pk if instance else None).exists():
            raise serializers.ValidationError("Employee ID already exists.")

        return value

    def validate_full_name(self, value):
        """Validate full_name"""
        if not value or not value.strip():
            raise serializers.ValidationError("Full name is required.")

        value = value.strip()

        if len(value) < 2:
            raise serializers.ValidationError("Full name must be at least 2 characters long.")

        return value

    def validate_email(self, value):
        """Validate email uniqueness"""
        if not value:
            raise serializers.ValidationError("Email is required.")

        value = value.strip().lower()

        # Check uniqueness (excluding current instance during update)
        instance = self.instance
        if Employee.objects.filter(email=value).exclude(pk=instance.pk if instance else None).exists():
            raise serializers.ValidationError("Email already exists.")

        return value

    def validate_department(self, value):
        """Validate department"""
        if not value or not value.strip():
            raise serializers.ValidationError("Department is required.")

        return value.strip()


class AttendanceSerializer(serializers.ModelSerializer):
    """Serializer for Attendance model"""
    employee_id = serializers.CharField(write_only=True)
    employee_name = serializers.CharField(source='employee.full_name', read_only=True)
    employee_emp_id = serializers.CharField(source='employee.employee_id', read_only=True)

    class Meta:
        model = Attendance
        fields = [
            'id', 'employee', 'employee_id', 'employee_name', 'employee_emp_id',
            'date', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'employee', 'created_at', 'updated_at']

    def validate_employee_id(self, value):
        """Validate employee exists"""
        if not value:
            raise serializers.ValidationError("Employee ID is required.")

        value = value.strip().upper()

        try:
            employee = Employee.objects.get(employee_id=value)
            return employee
        except Employee.DoesNotExist:
            raise serializers.ValidationError(f"Employee with ID '{value}' does not exist.")

    def validate_date(self, value):
        """Validate attendance date"""
        if not value:
            raise serializers.ValidationError("Date is required.")

        if value > timezone.now().date():
            raise serializers.ValidationError("Cannot mark attendance for future dates.")

        return value

    def validate_status(self, value):
        """Validate status"""
        if not value:
            raise serializers.ValidationError("Status is required.")

        if value not in ['Present', 'Absent']:
            raise serializers.ValidationError("Status must be either 'Present' or 'Absent'.")

        return value

    def validate(self, attrs):
        """Validate unique attendance per employee per day"""
        employee = attrs.get('employee_id')  # This is actually the Employee object from validate_employee_id
        date = attrs.get('date')

        if employee and date:
            # Check for existing attendance
            existing = Attendance.objects.filter(
                employee=employee,
                date=date
            )

            # Exclude current instance during update
            if self.instance:
                existing = existing.exclude(pk=self.instance.pk)

            if existing.exists():
                raise serializers.ValidationError({
                    'detail': f"Attendance for employee {employee.employee_id} on {date} already exists."
                })

        return attrs

    def create(self, validated_data):
        """Create attendance record"""
        employee = validated_data.pop('employee_id')
        validated_data['employee'] = employee
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Update attendance record"""
        if 'employee_id' in validated_data:
            employee = validated_data.pop('employee_id')
            validated_data['employee'] = employee
        return super().update(instance, validated_data)


class DashboardStatsSerializer(serializers.Serializer):
    """Serializer for dashboard statistics"""
    total_employees = serializers.IntegerField()
    present_today = serializers.IntegerField()
    absent_today = serializers.IntegerField()
    attendance_rate = serializers.FloatField()
