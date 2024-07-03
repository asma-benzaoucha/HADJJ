from rest_framework import serializers
from municipal_wilaya.models import Hospital
from django.contrib.contenttypes.models import ContentType
from users.serializers import validators
from django.db.models import Q
from rest_framework.exceptions import ValidationError
from .models import MedicalAdminProfile  , User, AdminProfile
from municipal_wilaya.models import Wilaya, Hospital


class UserMedicalAdminProfileSerializer(serializers.ModelSerializer):
    email = serializers.CharField(validators = validators.unique_email)
    role = serializers.CharField(max_length=15, default=User.IS_CANDIDATE)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id",'first_name','last_name','email','password','gender','role']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'gender': {'required': True},
            'role'  : {'read_only': True},
            'id': {'read_only': True}
        }
        
    def create(self, validated_data):
        user = User(
            email=validated_data['email'],
            username=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            gender=validated_data["gender"],
            role = validated_data["role"] if 'role' in validated_data else User.IS_CANDIDATE
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class TimeSlotSerializer(serializers.Serializer):
    day = serializers.CharField()
    times = serializers.ListField(child=serializers.CharField())


class MedicalAdminProfileSerializer(serializers.ModelSerializer):
    user = UserMedicalAdminProfileSerializer()
    work_schedule = TimeSlotSerializer(many=True)  
    # hospital_name = serializers.CharField(write_only=True)
    
    class Meta:
        model = MedicalAdminProfile
        fields = ['user','work_schedule', "profile_picture"]
    
    def create(self, validated_data):        
        hospital_name = self.context['request'].data.get('hospital_name')
        # Check if the hospital exists
        try: 
            hospital = Hospital.objects.get(Q(name=hospital_name) | Q(eng_name=hospital_name))
        except Hospital.DoesNotExist:
            raise ValidationError({"hospital_name": "Hospital with this name does not exist."})
        user_data = validated_data.pop('user')
        # Generate the password as concatenation of last name and email
        password =user_data.get('email', '')
        # Set the password in user_data
        user_data['password'] = password

        user = UserMedicalAdminProfileSerializer.create(UserMedicalAdminProfileSerializer(), validated_data=user_data)
        work_schedule = validated_data.pop('work_schedule')
        
        medical_admin = MedicalAdminProfile.objects.create(
            user=user,
            content_type=ContentType.objects.get_for_model(Hospital),
            object_id=hospital.id,
            work_schedule=work_schedule,
            profile_picture = validated_data["profile_picture"]
        )
        return medical_admin
    

    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            for key, value in user_data.items():
                setattr(user, key, value)
            user.save()

        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        return instance
    
    def delete(self, *args, **kwargs):
        # Delete the associated User record
        try:
            user = self.user
            user.delete()
        except User.DoesNotExist:
            pass  # User already deleted, do nothing

        super().delete(*args, **kwargs)
    
    



class CandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'



class AdminProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id','first_name','last_name','email','password','gender','wilaya']
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True}
        }
    wilaya = serializers.IntegerField(write_only=True)
    
    def get_wilaya(self, obj):
        wilaya = Wilaya.objects.get(id=obj.admin_profile.object_id)
        return {
            'id': wilaya.id,
            'name': wilaya.name
        }
        
    def create(self, validated_data):
        print(validated_data)
        wilaya = validated_data.pop('wilaya')
        validated_data['username'] = validated_data['email']
        validated_data['role'] = User.IS_ADMIN
        if User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({'success':False, 'email': 'email already exists'})
        
        
        if AdminProfile.objects.filter(object_id=wilaya).exists():
            raise serializers.ValidationError({'success':False, 'wilaya': 'wilaya already has an admin'})
        
        user = User.objects.create_user(**validated_data)
        content_type = ContentType.objects.get_for_model(Wilaya)
        AdminProfile.objects.create(user=user, object_id=wilaya, content_type = content_type)
        return user
    
    def update(self, instance, validated_data):
        wilaya = validated_data.pop('wilaya')
        AdminProfile.objects.filter(user=instance).update(object_id=wilaya)
        instance.save()
        return instance
    
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if hasattr(instance, 'admin_profile'):
            wilaya = Wilaya.objects.get(id=instance.admin_profile.object_id)
            representation['wilaya'] = {
                'id': wilaya.id,
                'name': wilaya.name
            }
        return representation
    
    


class HospitalScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalAdminProfile
        fields = ['object_id', 'work_schedule']

    work_schedule = serializers.SerializerMethodField()

    def get_work_schedule(self, obj):
        return obj.work_schedule
    


class HospitalWithScheduleSerializer(serializers.Serializer):
    hospital_name = serializers.CharField()
    work_schedule = serializers.ListField(child=serializers.DictField())


class HospitalsAdminSerializer(serializers.ModelSerializer):
    #work_schedules = serializers.SerializerMethodField()

    class Meta:
        model = Hospital
        fields = '__all__'


# """
# class CompanionInfoSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CompanionInfo
#         fields = '__all__'

# class UserInscriptionHistorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserInscriptionHistory
#         fields = '__all__'
# """

