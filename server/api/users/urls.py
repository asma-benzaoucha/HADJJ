from django.urls import path
from .views import (
    sign_up,
    log_in,
    # for forget password
    send_reset_password_code,
    verify_reset_password_code,
    send_new_code,
    reset_password,
    # for email validation
    verify_email_validation_code,
    send_email_validation_code,
    get_user_status
)

urlpatterns = [
    path('sign-up', sign_up),
    path('log-in', log_in),
    # 
    path('new-code', send_new_code),
    ##############################
    path('email-verification', send_reset_password_code), # this is for forget password
    path('code-verification', verify_reset_password_code),
    path('reset-password', reset_password),
    ##############################
    path('email-validation-code', send_email_validation_code),
    path('email-validation', verify_email_validation_code), # this is for email validation

    path('status', get_user_status, name='get_user_status')
]
