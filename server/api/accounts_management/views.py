from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from roles.roles import IsAdminUser, IsGeneralAdminOrAdminUser
from django.db.models import Q
from .models import MedicalAdminProfile
from users.models import User, UserInscriptionHistory, UserStatus
from personal_profile.models import PersonalProfile
from .serializers import MedicalAdminProfileSerializer, CandidateSerializer, AdminProfileSerializer
from rest_framework import status
from users.serializers import UserSerializer



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


@api_view(["GET"])
@permission_classes([IsAdminUser])
def search_users(request):
    user = request.user
    wilaya = user.admin_profile.object_id
    users = User.objects.filter(personal_profile__wilaya=wilaya)
    users_data = UserSerializer(users, many=True).data
    status_Dictionary= {'P': 'Pending', 'R': 'Rejected', 'C': 'Confirmed', 'I': 'In reserve'}
    process_Dictionary= {'I': 'Inscription', 'L': 'Lottery', 'V': 'Med visit', 'P': 'Payment', 'R': 'Reservation'}
    gender_dictionary = {"M":"Male", "F":"Female"}
    for i in range(len(users_data)):
        email = users_data[i]["email"]
        users_data[i]["gender"] = gender_dictionary[users_data[i]["gender"]]
        users_data[i]["nin"]= PersonalProfile.objects.get(user__email=email).nin
        users_data[i]["profile_picture"]= PersonalProfile.objects.get(user__email=email).picture or None
        users_data[i]["file"]= PersonalProfile.objects.get(user__email=email).files or None
        users_data[i]["birth_date"]= PersonalProfile.objects.get(user__email=email).birth_date
        users_data[i]["municipal"]= PersonalProfile.objects.get(user__email=email).municipal.name
        users_data[i]["phase"]=process_Dictionary[UserStatus.objects.get(user__email=email).process]
        users_data[i]["phase_status"]=status_Dictionary[UserStatus.objects.get(user__email=email).status]
        users_data[i]["contact"] = PersonalProfile.objects.get(user__email=email).phone_number
        users_data[i]["participation_number"] = UserInscriptionHistory.objects.get(user__email=email).inscription_count
        
        
    return Response(users_data, status=status.HTTP_200_OK)
 
 
@api_view(["GET"])
# @permission_classes([IsGeneralAdminOrAdminUser])
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
        return Response({"success":True}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["PATCH", "DELETE"])
# @permission_classes([IsGeneralAdminOrAdminUser])
def update_delete_admin(request, admin_id):
    try:
        admin = User.objects.get(id=admin_id)
    except User.DoesNotExist:
        return Response({"success":False,"message": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == "PATCH":

        serializer = AdminProfileSerializer(admin, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    else: # DELETE
        admin.delete()
        return Response({"success":True}, status=status.HTTP_200_OK)
    
    
    
        
        
        
     
        





# guide
"""
@api_view(['POST'])
@permission_classes([IsAdminUser])
def add_guide(request):
    serializer = GuideSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_guide(request, guide_id):
    try:
        guide = Guide.objects.get(id=guide_id)
        guide.delete()
        return Response({'message': 'Guide deleted successfully'}, status=204)
    except Guide.DoesNotExist:
        return Response({'message': 'Guide not found'}, status=404)
"""
