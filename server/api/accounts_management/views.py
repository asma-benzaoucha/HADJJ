from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from roles.roles import IsAdminUser ,IsCandidateUser,IsGeneralAdminUser
from users.models import User
from rest_framework.decorators import (api_view,permission_classes)
from .models import MedicalAdminProfile 
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from base64 import b64encode
from rest_framework.permissions import IsAuthenticated
from roles.roles import IsAdminUser, IsGeneralAdminOrAdminUser, IsMedicalAdminUser
from django.db.models import Q
from users.models import User, UserInscriptionHistory, UserStatus
from personal_profile.models import PersonalProfile
from personal_profile.serializers import CompanionSerializer

from .serializers import MedicalAdminProfileSerializer, CandidateSerializer, AdminProfileSerializer ,HospitalsAdminSerializer,HospitalScheduleSerializer


from collections import defaultdict

from .serializers import (
    MedicalAdminProfileSerializer,
    CandidateSerializer,
    AdminProfileSerializer,
)
from users.serializers import UserSerializer
from municipal_wilaya.models import Wilaya, Hospital
from personal_profile.models import PersonalProfile, Companion



@api_view(["GET"])
@permission_classes([IsAdminUser])
def search_medical_admins(request):
    user = request.user
    wilaya = user.responsibility.wilaya
    medical_admins = MedicalAdminProfile.objects.filter(
        user__personal_profile__wilaya__id=wilaya.id
    )

    gender = request.GET.get("gender")
    if gender:
        medical_admins = medical_admins.filter(user__gender=gender)

    municipal_id = request.GET.get("municipal")
    if municipal_id:
        medical_admins = medical_admins.filter(user__municipal=municipal_id)

    hospital_id = request.GET.get("hospital")
    if hospital_id:
        medical_admins = medical_admins.filter(
            user__personal_profile__hospital__id=hospital_id
        )

    q_type = request.GET.get("q")
    q_value = request.GET.get("value")
    if q_type and q_value:
        if q_type == "nin":
            medical_admins = medical_admins.filter(user__nin__startswith=q_value)
        elif q_type == "name":
            medical_admins = medical_admins.filter(
                Q(user__first_name__startswith=q_value)
                | Q(user__last_name__startswith=q_value)
            )
        elif q_type == "email":
            medical_admins = medical_admins.filter(user__email__startswith=q_value)
        elif q_type == "phone_number":
            medical_admins = medical_admins.filter(
                user__phone_number__startswith=q_value
            )

    serializer = MedicalAdminProfileSerializer(medical_admins, many=True)
    return Response(serializer.data)


# candidat


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def edit_candidate_info(request, candidate_id):
    try:
        candidate = User.objects.get(id=candidate_id)
    except User.DoesNotExist:
        return Response({"message": "Candidate not found"}, status=404)

    if request.method == "GET":
        serializer = CandidateSerializer(candidate)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = CandidateSerializer(candidate, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


def get_user_data(users_data):
    status_Dictionary = {
        "P": "Pending",
        "R": "Rejected",
        "C": "Confirmed",
        "I": "In reserve",
    }
    process_Dictionary = {
        "I": "Inscription",
        "L": "Lottery",
        "V": "Med visit",
        "P": "Payment",
        "R": "Reservation",
    }
    gender_dictionary = {"M": "Male", "F": "Female"}
    for i in range(len(users_data)):
        email = users_data[i]["email"]
        personal_profile = PersonalProfile.objects.get(user__email=email)
        gender = users_data[i]["gender"]
        users_data[i]["gender"] = gender_dictionary[users_data[i]["gender"]]

        users_data[i]["nin"] = personal_profile.nin

        picture_data = (
            personal_profile.picture.read() if personal_profile.picture else None
        )
        files_data = personal_profile.files.read() if personal_profile.files else None

        users_data[i]["profile_pic"] = (
            b64encode(picture_data).decode("utf-8") if picture_data else None
        )
        users_data[i]["file"] = (
            b64encode(files_data).decode("utf-8") if files_data else None
        )

        users_data[i]["birth_date"] = personal_profile.birth_date
        users_data[i]["municipal"] = personal_profile.municipal.name
        users_data[i]["phase"] = process_Dictionary[
            UserStatus.objects.get(user__email=email).process
        ]
        users_data[i]["phase_status"] = status_Dictionary[
            UserStatus.objects.get(user__email=email).status
        ]
        users_data[i]["contact"] = personal_profile.phone_number
        print(gender)
        if gender == "F":
                print("here")
                try:
                    user = User.objects.get(email=email)
                    comp = Companion.objects.get(user=user)
                    print(comp)
                    ser = CompanionSerializer(comp)
                    
                    users_data[i]["companion"] = ser.data
                except User.DoesNotExist:
                    pass
        try:
            x = UserInscriptionHistory.objects.get(user__email=email)
        except UserInscriptionHistory.DoesNotExist:
            pass
        users_data[i]["participation_number"] = x.inscription_count if x else -1

        
        

    return users_data


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_all_users(request):
    user = request.user
    wilaya = user.admin_profile.object_id
    users = User.objects.filter(personal_profile__wilaya=wilaya, role = User.IS_CANDIDATE)
    users_data = UserSerializer(users, many=True).data
    return Response(get_user_data(users_data), status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsMedicalAdminUser])
def search_user(request):
    user = request.user
    hospital = user.medical_admin_profile.object_id
    wilaya_id = Hospital.objects.get(id=hospital).wilaya
    users = User.objects.filter(personal_profile__wilaya=wilaya_id, status__process = UserStatus.Process.VISIT)
    users_data = UserSerializer(users, many=True).data
    return Response(get_user_data(users_data), status=status.HTTP_200_OK)



@api_view(["GET"])
@permission_classes([IsGeneralAdminOrAdminUser])
def get_all_admins(_):
    admins = User.objects.filter(role=User.IS_ADMIN)
    serializer = AdminProfileSerializer(admins, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([IsGeneralAdminOrAdminUser])
def create_new_admin(request):

    data = request.data
    print(data)
    serializer = AdminProfileSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({"success": True}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH", "DELETE"])
@permission_classes([IsGeneralAdminOrAdminUser])
def update_delete_admin(request, admin_id):
    try:
        admin = User.objects.get(id=admin_id)
    except User.DoesNotExist:
        return Response(
            {"success": False, "message": "Admin not found"},
            status=status.HTTP_404_NOT_FOUND,
        )
    if request.method == "PATCH":

        serializer = AdminProfileSerializer(admin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
    else: # DELETE
        admin.delete()
        return Response({"success":True}, status=status.HTTP_200_OK)
    


# guide
# """
# @api_view(['POST'])
# @permission_classes([IsAdminUser])
# def add_guide(request):
#     serializer = GuideSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)

# @api_view(['DELETE'])
# @permission_classes([IsAdminUser])
# def delete_guide(request, guide_id):
#     try:
#         guide = Guide.objects.get(id=guide_id)
#         guide.delete()
#         return Response({'message': 'Guide deleted successfully'}, status=204)
#     except Guide.DoesNotExist:
#         return Response({'message': 'Guide not found'}, status=404)
# """





@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_medical_admin(request):
    
    serializer = MedicalAdminProfileSerializer(data=request.data, context={'request': request})
    print("here 2")
    # print(request.data)
    if serializer.is_valid():
        print("here 3")
        medical_admin = serializer.save()  # Save the instance once
        
        # Send email to the newly added medical admin
        email_subject = 'Welcome to our platform'
        email_message = f'Hello {medical_admin.user.first_name},\n\nYou have been added as a medical admin on our platform. Your password is the concatenation of your last name and email. Thank you.'

        send_mail(
            email_subject,
            email_message,
            settings.EMAIL_HOST_USER,
            [medical_admin.user.email],
            fail_silently=False,
        )
        return Response({'success': True, 'message': 'Medical admin added successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_medical_admin(request, pk):
    # try:
    #     medical_admin = MedicalAdminProfile.objects.get(pk=pk)
    # except MedicalAdminProfile.DoesNotExist:
    #     return Response({'error': 'Medical admin not found'}, status=status.HTTP_404_NOT_FOUND)

    # user_id = medical_admin.user.id  
    # medical_admin.delete()

    try:
        user = User.objects.get(id=pk)
        user.delete()
    except User.DoesNotExist:
        return Response({'error': 'Medical admin not found'}, status=status.HTTP_404_NOT_FOUND)
        

    return Response({'success': True, 'message': 'Medical admin deleted successfully'}, status=status.HTTP_200_OK)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_medical_admin(request, pk):
    try:
        medical_admin = MedicalAdminProfile.objects.get(pk=pk)
    except MedicalAdminProfile.DoesNotExist:
        return Response({'error': 'Medical admin not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = MedicalAdminProfileSerializer(medical_admin, data=request.data, partial=True)
    if serializer.is_valid():
        user_data = serializer.validated_data.get('user', {})
        user = medical_admin.user
        for key, value in user_data.items():
            setattr(user, key, value)
        user.save()
        serializer.save()

        return Response({'success': True, 'message': 'Medical admin updated successfully'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_hospitals_in_wilaya(request):
    try:
        wilaya_id = request.user.admin_profile.object_id
        hospitals = Hospital.objects.filter(wilaya_id=wilaya_id)
        serializer = HospitalsAdminSerializer(hospitals, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'error': 'Admin not found'}, status=status.HTTP_404_NOT_FOUND)
    except Hospital.DoesNotExist:
        return Response({'error': 'Hospitals not found for this wilaya'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_medical_admins(request):
    user = request.user
    wilaya= user.admin_profile.object_id
    hospitals_ids = Hospital.objects.filter(wilaya=wilaya).values_list("id")
    medical_admins = MedicalAdminProfile.objects.filter(object_id__in = hospitals_ids)
    serializer = MedicalAdminProfileSerializer(medical_admins, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsCandidateUser])
def get_hospitals_in_wilaya_with_schedule(request):
    try:
        user_id = request.user.id
        personal_profile = PersonalProfile.objects.get(user_id=user_id)
        wilaya_id = personal_profile.wilaya_id
        hospital_ids = list(Hospital.objects.filter(wilaya_id=wilaya_id).values_list('id', flat=True))
        hospital_schedules = MedicalAdminProfile.objects.filter(object_id__in=hospital_ids)
        serializer = HospitalScheduleSerializer(hospital_schedules, many=True)
        schedules_by_hospital_day = defaultdict(lambda: defaultdict(list))
        for schedule in serializer.data:
            hospital_id = schedule['object_id']
            hospital_name = Hospital.objects.get(id=hospital_id).name
            for day_schedule in schedule['work_schedule']:
                day = day_schedule['day']
                times = day_schedule['times']
                schedules_by_hospital_day[hospital_name][day].extend(times)
        
        hospitals_with_schedule = []
            # Merge overlapping time ranges for each day in each hospital
        for hospital_name, day_schedules in schedules_by_hospital_day.items():
            for day, times in day_schedules.items():
                day_schedules[day] = merge_time_ranges(day, times)

            hospital_data = {
                'hospital_name': hospital_name,
                'work_schedule': [{'day': day, 'times': times} for day, times in day_schedules.items()]
            }
            hospitals_with_schedule.append(hospital_data)

        return Response(hospitals_with_schedule)
    except PersonalProfile.DoesNotExist:
        return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Hospital.DoesNotExist:
        return Response({'error': 'Hospitals not found for this wilaya'}, status=status.HTTP_404_NOT_FOUND)
    
def merge_time_ranges(day, times):
    sorted_times = sorted(times)
    merged_ranges = []
    current_range_start = None
    current_range_end = None

    for time_range in sorted_times:
        start, end = time_range.split('-')
        start_hour, start_minute = start.split(':')
        end_hour, end_minute = end.split(':')
        start_time = int(start_hour) * 60 + int(start_minute)
        end_time = int(end_hour) * 60 + int(end_minute)

        if current_range_start is None:
            current_range_start = start_time
            current_range_end = end_time
        elif start_time <= current_range_end:
            current_range_end = max(current_range_end, end_time)
        else:
            merged_ranges.append((current_range_start, current_range_end))
            current_range_start = start_time
            current_range_end = end_time

    if current_range_start is not None:
        merged_ranges.append((current_range_start, current_range_end))

    return [{ f"{start // 60:02d}:{start % 60:02d}-{end // 60:02d}:{end % 60:02d}" for start, end in merged_ranges}]

# # Example usage
# times = ["08:00-12:00", "14:00-16:00"]
# result = merge_time_ranges("Monday", times)
# print(result)




