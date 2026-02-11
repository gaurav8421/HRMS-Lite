"""
Custom exception handler for HRMS API
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Customize the response data
        custom_response_data = {
            'success': False,
            'error': {}
        }

        # Handle validation errors
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response_data['error'] = {
                    'message': response.data['detail']
                }
            else:
                custom_response_data['error'] = response.data
        else:
            custom_response_data['error'] = {
                'message': str(response.data)
            }

        response.data = custom_response_data

    return response
