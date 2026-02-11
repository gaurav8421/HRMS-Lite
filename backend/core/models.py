"""
Database models for HRMS Lite
"""
from django.db import models
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError


class Employee(models.Model):
    """
    Employee model to store employee information
    """
    employee_id = models.CharField(
        max_length=20,
        unique=True,
        verbose_name="Employee ID",
        help_text="Unique employee identifier (e.g., EMP001)"
    )
    full_name = models.CharField(
        max_length=200,
        verbose_name="Full Name",
        help_text="Employee's full name"
    )
    email = models.EmailField(
        unique=True,
        validators=[EmailValidator()],
        verbose_name="Email Address",
        help_text="Employee's email address"
    )
    department = models.CharField(
        max_length=100,
        verbose_name="Department",
        help_text="Department name (e.g., IT, HR, Sales)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'employees'
        ordering = ['-created_at']
        verbose_name = 'Employee'
        verbose_name_plural = 'Employees'

    def __str__(self):
        return f"{self.employee_id} - {self.full_name}"

    def clean(self):
        """Custom validation"""
        if self.employee_id:
            self.employee_id = self.employee_id.strip().upper()
        if self.full_name:
            self.full_name = self.full_name.strip()
        if self.email:
            self.email = self.email.strip().lower()
        if self.department:
            self.department = self.department.strip()


class Attendance(models.Model):
    """
    Attendance model to track employee attendance
    """
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
    ]

    employee = models.ForeignKey(
        Employee,
        on_delete=models.CASCADE,
        related_name='attendances',
        verbose_name="Employee"
    )
    date = models.DateField(
        verbose_name="Date",
        help_text="Attendance date"
    )
    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        verbose_name="Status",
        help_text="Attendance status (Present/Absent)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'attendances'
        ordering = ['-date']
        verbose_name = 'Attendance'
        verbose_name_plural = 'Attendances'
        unique_together = ['employee', 'date']
        indexes = [
            models.Index(fields=['employee', 'date']),
            models.Index(fields=['date']),
        ]

    def __str__(self):
        return f"{self.employee.employee_id} - {self.date} - {self.status}"

    def clean(self):
        """Custom validation to prevent duplicate attendance"""
        if self.employee and self.date:
            existing = Attendance.objects.filter(
                employee=self.employee,
                date=self.date
            ).exclude(pk=self.pk)

            if existing.exists():
                raise ValidationError(
                    f"Attendance for {self.employee.employee_id} on {self.date} already exists."
                )
