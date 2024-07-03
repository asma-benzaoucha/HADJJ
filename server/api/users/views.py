from base64 import b64encode
import requests
from django.core.mail import send_mail
from api.settings import EMAIL_HOST_USER
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import UserSerializer, UserStatusSerializer
from pilgrimage_info.serializers import PhaseSerializer

from .models import (
    UserStatus,
    UserInscriptionHistory as UserIns,
    User,
    UserVerificationCode,
    UserEmailVerification
)
from lottery.models import ParticipantStatusPhase
from pilgrimage_info.models import Phase
from accounts_management.models import AdminProfile
from personal_profile.models import PersonalProfile
from roles.roles import IsCandidateUser

# Create your views here.
import random

@api_view(["GET"])
@permission_classes([IsCandidateUser])
def get_user_status(request):
    user = request.user
    user_status = {}
    try:
        x = UserStatus.objects.get(user=user)
        user_status = UserStatusSerializer(x).data
    except UserStatus.DoesNotExist:
        pass
    return Response(user_status, status=status.HTTP_200_OK)


def generate_random_numbers():
    """Generates a string of 6 random numbers."""
    numbers = [str(random.randint(0, 9)) for _ in range(6)]
    return "".join(numbers)


def validate_email(email):
    key = "53f9304ee2994fb2bc408fdc7928d4e4"
    api_url = f"https://emailvalidation.abstractapi.com/v1/?api_key={key}&email={email}"
    response = requests.get(api_url)
    data = response.json()
    if (
        data["is_valid_format"]["value"]
        and data["is_mx_found"]["value"]
        and data["is_smtp_valid"]["value"]
        and not data["is_catchall_email"]["value"]
        and not data["is_role_email"]["value"]
        and data["is_free_email"]["value"]
    ):
        return True
    return False


@api_view(["POST"])
@permission_classes([AllowAny])
def sign_up(request):
    data = request.data
    # email = data.get('email')
    # if email is not None:
    #     if  validate_email(email) == True:
    #         pass
    #     else:
    #         return Response(
    #             {"success": False, "error": "Invalid email"},
    #             status=status.HTTP_401_UNAUTHORIZED,
    #         )
    serializer = UserSerializer(data=data)
    if serializer.is_valid():

        user = serializer.save()
        code = generate_random_numbers()
        # create a user email verification code
        UserEmailVerification.objects.create(user=user, code=code)

        response = {"success": True}
        return Response(response, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def log_in(request):
    email = request.data.get("email")
    password = request.data.get("password")
    print(email, password)
    user = None
    user = authenticate(request=request, email=email, password=password)

    if user:
        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token
        response = {
            "access": str(access_token),
            "refresh": str(refresh_token),
            "role": user.role,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "gender": user.gender,
        }
        if user.role ==User.IS_MEDICAL_ADMIN:
            # picture = (user.medical_admin_profile.profile_picture.read() if user.medical_admin_profile.profile_picture else None)
            # response["profile_pic"]= b64encode(picture).decode("utf-8") 
            response['wilaya'] = {
                "id": user.medical_admin_profile.object_id,
                "name": user.medical_admin_profile.content_object.name
            }
        if user.role == User.IS_ADMIN:
            response['wilaya'] = {
                "id": user.admin_profile.object_id,
                "name": user.admin_profile.content_object.name
            }
        elif user.role == User.IS_CANDIDATE:
            user_status = {}
            user_status = {}
            response["profile_pic"] = None
            try :
                profile = PersonalProfile.objects.get(user=user)
                picture = (profile.picture.read() if profile.picture else None)
                response["profile_pic"] = b64encode(picture).decode("utf-8")
            except:
                pass
            user_status['phase'] = None
            user_status['status'] = None
            try:
                par_status_phase = ParticipantStatusPhase.objects.get(participant=user)
                phase = Phase.objects.get(id=par_status_phase.phase.id)
                user_status = {
                    "phase": PhaseSerializer(phase).data,
                }
            except ParticipantStatusPhase.DoesNotExist:
                pass
            
            try:
                user_stat = UserStatus.objects.get(user=user)
                user_status['status'] = UserStatusSerializer(user_stat).data
            except UserStatus.DoesNotExist:
                pass
            response['user_status'] = user_status
            is_pilgrim = False
            try:
                user_inscription_history = UserIns.objects.get(user=user)
                is_pilgrim = (
                    True if user_inscription_history.inscription_count == -1 else False
                )
            except UserIns.DoesNotExist:
                user_inscription_history = None
            response["is_pilgrim"] = is_pilgrim
            is_email_verified = False
            try:
                UserEmailVerification.objects.get(user=user)
                is_email_verified = False
            except UserEmailVerification.DoesNotExist:
                is_email_verified = True
            response["is_email_verified"] = is_email_verified    
            
        print(response)
        return Response(response, status=status.HTTP_200_OK)
    return Response(
        {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
    )




@api_view(["POST"])
@permission_classes([AllowAny])
def send_reset_password_code(request):
    # check if the email is related to real user
    # if so send verification code to the user's email
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        code = generate_random_numbers()
        # delete any previous verification code
        UserVerificationCode.objects.filter(user=user).delete()
        # generate a verification code and save it in the database
        obj = UserVerificationCode.objects.create(user=user, code=code)
        # send the verification code to the user's email
        send_mail(
            subject="reset password verification code",
            message=f"this is your verification code {code}",
            from_email=EMAIL_HOST_USER,
            recipient_list=[email],
        )

        refresh_token = RefreshToken.for_user(user)
        access_token = refresh_token.access_token

        response = {
            "access": str(access_token),
            "refresh": str(refresh_token),
            "role": user.role,
        }

        return Response(response, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response(
            {"success": False, "error": "Invalid email"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_reset_password_code(request):
    user = request.user
    code = request.data.get("code")
    if code is None:
        return Response(
            {"success": False, "error": "code is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    try:
        
        user_verification_code = UserVerificationCode.objects.get(user=user)

        if user_verification_code.code == code:
            user_verification_code.delete()
            return Response(
                {"success": True, "message": "code verified"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"success": False, "error": "Invalid code"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    except UserVerificationCode.DoesNotExist:
        return Response(
            {"success": False, "error": "Invalid code"},
            status=status.HTTP_401_UNAUTHORIZED,
        )



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def reset_password(request):
    user = request.user
    password = request.data.get("password")
    if password is None:
        return Response(
            {"success": False, "error": "password is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user.set_password(password)
    user.save()
    return Response(
        {"success": True, "message": "password changed"},
        status=status.HTTP_200_OK,
    )




@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_email_validation_code(request):
     # use to send and resend code for email validation
    user = request.user
    code = generate_random_numbers()
    # create a user email verification code
    try:
        obj = UserEmailVerification.objects.get(user=user)
        code = obj.code
    except UserEmailVerification.DoesNotExist:
        # should not happen
        obj = UserEmailVerification.objects.create(user=user, code=code)
        
    send_mail(
            subject="email validation code",
            message=f"this is your verification code {code}",
            from_email=EMAIL_HOST_USER,
            recipient_list=[user.email],
        )
    
    return Response({"success": True, "message": "code sent"}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_email_validation_code(request):
   
    code = request.data.get("code")
    if code is None:
        return Response(
            {"success": False, "error": "code is required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = request.user
    try:
        user_email_verification = UserEmailVerification.objects.get(user=user)
        if user_email_verification.code == code:
            user_email_verification.delete()
            return Response(
                {"success": True, "message": "email verified"},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"success": False, "error": "Invalid code"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
    except UserEmailVerification.DoesNotExist:
        return Response(
            {"success": False, "error": "Invalid code"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
        
        
        
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_new_code(request):
    user = request.user
    code = generate_random_numbers()
    is_email_validation = request.data.get('is_email_validation')
    
    if is_email_validation is None:
        return Response({"success" : False, "error": "is_email_validation field is missing"}, status=status.HTTP_400_BAD_REQUEST)
    # generate a verification code and save it in the database
    if is_email_validation == False:
        try:
            obj = UserVerificationCode.objects.get(user=user)
            obj.code = code
            obj.save()
        except UserVerificationCode.DoesNotExist:
            obj = UserVerificationCode.objects.create(user=user, code=code)
    else:
        try:
            obj = UserEmailVerification.objects.get(user=user)
            obj.code = code
            obj.save()
        except UserEmailVerification.DoesNotExist:
            # should not happen
            obj = UserEmailVerification.objects.create(user=user, code=code)

    # send the verification code to the user's email
    subject = "reset password verification code" if is_email_validation == False else "email validation code"
    send_mail(
        subject=subject,
        message=f"this is your verification code {code}",
        from_email=EMAIL_HOST_USER,
        recipient_list=[user.email],
    )

    return Response(
        {"success": True, "message": "new code sent"},
        status=status.HTTP_200_OK,
    )
# import requests
# from django.core.mail import send_mail
# from api.settings import EMAIL_HOST_USER
# from rest_framework.response import Response
# from rest_framework.decorators import (
#     api_view,
#     permission_classes,
#     authentication_classes,
# )
# from rest_framework.permissions import IsAuthenticated, AllowAny
# from rest_framework import status
# from django.contrib.auth import authenticate
# from rest_framework_simplejwt.tokens import RefreshToken

# from .serializers import UserSerializer, UserStatusSerializer
# from pilgrimage_info.serializers import PhaseSerializer

# from .models import (
#     UserStatus,
#     UserInscriptionHistory as UserIns,
#     User,
#     UserVerificationCode,
#     UserEmailVerification
# )
# from lottery.models import ParticipantStatusPhase
# from pilgrimage_info.models import Phase
# from accounts_management.models import AdminProfile

# from roles.roles import IsCandidateUser

# # Create your views here.
# import random



# @api_view(["GET"])
# @permission_classes([IsCandidateUser])
# def get_user_status(request):
#     user = request.user
#     user_status = {}
#     try:
#         x = UserStatus.objects.get(user=user)
#         user_status = UserStatusSerializer(x).data
#     except UserStatus.DoesNotExist:
#         pass
#     return Response(user_status, status=status.HTTP_200_OK)

# def generate_random_numbers():
#     """Generates a string of 6 random numbers."""
#     numbers = [str(random.randint(0, 9)) for _ in range(6)]
#     return "".join(numbers)


# def validate_email(email):
#     key = "53f9304ee2994fb2bc408fdc7928d4e4"
#     api_url = f"https://emailvalidation.abstractapi.com/v1/?api_key={key}&email={email}"
#     response = requests.get(api_url)
#     data = response.json()
#     if (
#         data["is_valid_format"]["value"]
#         and data["is_mx_found"]["value"]
#         and data["is_smtp_valid"]["value"]
#         and not data["is_catchall_email"]["value"]
#         and not data["is_role_email"]["value"]
#         and data["is_free_email"]["value"]
#     ):
#         return True
#     return False


# @api_view(["POST"])
# @permission_classes([AllowAny])
# def sign_up(request):
#     data = request.data
#     # email = data.get('email')
#     # if email is not None:
#     #     if  validate_email(email) == True:
#     #         pass
#     #     else:
#     #         return Response(
#     #             {"success": False, "error": "Invalid email"},
#     #             status=status.HTTP_401_UNAUTHORIZED,
#     #         )
#     serializer = UserSerializer(data=data)
#     if serializer.is_valid():

#         user = serializer.save()
#         code = generate_random_numbers()
#         # create a user email verification code
#         UserEmailVerification.objects.create(user=user, code=code)

#         response = {"success": True}
#         return Response(response, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(["POST"])
# @permission_classes([AllowAny])
# def log_in(request):
#     email = request.data.get("email")
#     password = request.data.get("password")
#     print(email, password)
#     user = None
#     user = authenticate(request=request, email=email, password=password)

#     if user:
#         refresh_token = RefreshToken.for_user(user)
#         access_token = refresh_token.access_token
#         response = {
#             "access": str(access_token),
#             "refresh": str(refresh_token),
#             "role": user.role,
#             "first_name": user.first_name,
#             "last_name": user.last_name,
#             "gender": user.gender,
#         }
#         if user.role == User.IS_ADMIN:
#             response['wilaya'] = {
#                 "id": user.admin_profile.object_id,
#                 "name": user.admin_profile.content_object.name
#             }
#         elif user.role == User.IS_CANDIDATE:
#             user_status = {}
#             user_status = {}
#             # response["profile_pic"] = user.personal_profile.pi
#             user_status['phase'] = None
#             user_status['status'] = None
#             try:
#                 par_status_phase = ParticipantStatusPhase.objects.get(participant=user)
#                 phase = Phase.objects.get(id=par_status_phase.phase.id)
#                 user_status = {
#                     "phase": PhaseSerializer(phase).data,
#                 }
#             except ParticipantStatusPhase.DoesNotExist:
#                 pass
            
#             try:
#                 user_stat = UserStatus.objects.get(user=user)
#                 user_status['status'] = UserStatusSerializer(user_stat).data
#             except UserStatus.DoesNotExist:
#                 pass
#             response['user_status'] = user_status
#             is_pilgrim = False
#             try:
#                 user_inscription_history = UserIns.objects.get(user=user)
#                 is_pilgrim = (
#                     True if user_inscription_history.inscription_count == -1 else False
#                 )
#             except UserIns.DoesNotExist:
#                 user_inscription_history = None
#             response["is_pilgrim"] = is_pilgrim
#             is_email_verified = False
#             try:
#                 UserEmailVerification.objects.get(user=user)
#                 is_email_verified = False
#             except UserEmailVerification.DoesNotExist:
#                 is_email_verified = True
#             response["is_email_verified"] = is_email_verified    
            
#         print(response)
#         return Response(response, status=status.HTTP_200_OK)
#     return Response(
#         {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
#     )




# @api_view(["POST"])
# @permission_classes([AllowAny])
# def send_reset_password_code(request):
#     # check if the email is related to real user
#     # if so send verification code to the user's email
#     email = request.data.get("email")
#     try:
#         user = User.objects.get(email=email)
#         code = generate_random_numbers()
#         # delete any previous verification code
#         UserVerificationCode.objects.filter(user=user).delete()
#         # generate a verification code and save it in the database
#         obj = UserVerificationCode.objects.create(user=user, code=code)
#         # send the verification code to the user's email
#         send_mail(
#             subject="reset password verification code",
#             message=f"this is your verification code {code}",
#             from_email=EMAIL_HOST_USER,
#             recipient_list=[email],
#         )

#         refresh_token = RefreshToken.for_user(user)
#         access_token = refresh_token.access_token

#         response = {
#             "access": str(access_token),
#             "refresh": str(refresh_token),
#             "role": user.role,
#         }

#         return Response(response, status=status.HTTP_200_OK)
#     except User.DoesNotExist:
#         return Response(
#             {"success": False, "error": "Invalid email"},
#             status=status.HTTP_401_UNAUTHORIZED,
#         )


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def verify_reset_password_code(request):
#     user = request.user
#     code = request.data.get("code")
#     if code is None:
#         return Response(
#             {"success": False, "error": "code is required"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )
#     try:
        
#         user_verification_code = UserVerificationCode.objects.get(user=user)

#         if user_verification_code.code == code:
#             user_verification_code.delete()
#             return Response(
#                 {"success": True, "message": "code verified"},
#                 status=status.HTTP_200_OK,
#             )
#         return Response(
#             {"success": False, "error": "Invalid code"},
#             status=status.HTTP_401_UNAUTHORIZED,
#         )
#     except UserVerificationCode.DoesNotExist:
#         return Response(
#             {"success": False, "error": "Invalid code"},
#             status=status.HTTP_401_UNAUTHORIZED,
#         )



# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def reset_password(request):
#     user = request.user
#     password = request.data.get("password")
#     if password is None:
#         return Response(
#             {"success": False, "error": "password is required"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )
#     user.set_password(password)
#     user.save()
#     return Response(
#         {"success": True, "message": "password changed"},
#         status=status.HTTP_200_OK,
#     )




# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def send_email_validation_code(request):
#      # use to send and resend code for email validation
#     user = request.user
#     code = generate_random_numbers()
#     # create a user email verification code
#     try:
#         obj = UserEmailVerification.objects.get(user=user)
#         code = obj.code
#     except UserEmailVerification.DoesNotExist:
#         # should not happen
#         obj = UserEmailVerification.objects.create(user=user, code=code)
        
#     send_mail(
#             subject="email validation code",
#             message=f"this is your verification code {code}",
#             from_email=EMAIL_HOST_USER,
#             recipient_list=[user.email],
#         )
    
#     return Response({"success": True, "message": "code sent"}, status=status.HTTP_200_OK)


# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def verify_email_validation_code(request):
   
#     code = request.data.get("code")
#     if code is None:
#         return Response(
#             {"success": False, "error": "code is required"},
#             status=status.HTTP_400_BAD_REQUEST,
#         )
#     user = request.user
#     try:
#         user_email_verification = UserEmailVerification.objects.get(user=user)
#         if user_email_verification.code == code:
#             user_email_verification.delete()
#             return Response(
#                 {"success": True, "message": "email verified"},
#                 status=status.HTTP_200_OK,
#             )
#         return Response(
#             {"success": False, "error": "Invalid code"},
#             status=status.HTTP_401_UNAUTHORIZED,
#         )
#     except UserEmailVerification.DoesNotExist:
#         return Response(
#             {"success": False, "error": "Invalid code"},
#             status=status.HTTP_401_UNAUTHORIZED,
#         )
        
        
        
# @api_view(["POST"])
# @permission_classes([IsAuthenticated])
# def send_new_code(request):
#     user = request.user
#     code = generate_random_numbers()
#     is_email_validation = request.data.get('is_email_validation')
    
#     if is_email_validation is None:
#         return Response({"success" : False, "error": "is_email_validation field is missing"}, status=status.HTTP_400_BAD_REQUEST)
#     # generate a verification code and save it in the database
#     if is_email_validation == False:
#         try:
#             obj = UserVerificationCode.objects.get(user=user)
#             obj.code = code
#             obj.save()
#         except UserVerificationCode.DoesNotExist:
#             obj = UserVerificationCode.objects.create(user=user, code=code)
#     else:
#         try:
#             obj = UserEmailVerification.objects.get(user=user)
#             obj.code = code
#             obj.save()
#         except UserEmailVerification.DoesNotExist:
#             # should not happen
#             obj = UserEmailVerification.objects.create(user=user, code=code)

#     # send the verification code to the user's email
#     subject = "reset password verification code" if is_email_validation == False else "email validation code"
#     send_mail(
#         subject=subject,
#         message=f"this is your verification code {code}",
#         from_email=EMAIL_HOST_USER,
#         recipient_list=[user.email],
#     )

#     return Response(
#         {"success": True, "message": "new code sent"},
#         status=status.HTTP_200_OK,
#     )