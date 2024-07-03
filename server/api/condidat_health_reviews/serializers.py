from rest_framework import serializers
from .models import PatientHealthReview
from users.models import UserStatus
from promote_backup.promote_backup import promote_backup


class PatientHealthReviewSerializer(serializers.ModelSerializer):
    treatments = serializers.ListField(child=serializers.CharField(max_length=255), allow_empty=True, required=False)
    diseases = serializers.ListField(child=serializers.CharField(max_length=255), allow_empty=True, required=False)

    class Meta:
        model = PatientHealthReview
        fields = '__all__'
        # extra_kwargs = {
        #     'diseases': {'required': False},
        #     'treatments': {'required': False},
        # }

    def validate(self, data):
        is_sick = data.get('is_sick')
        is_healthy = data.get('is_healthy')
        is_accepted = data.get('is_accepted')
        if is_healthy and is_sick:
            raise serializers.ValidationError({"detail": "Patient cannot be both healthy and sick"})
        if not is_healthy and not is_sick:
            raise serializers.ValidationError({"detail": "Patient must be either healthy or sick"})
        if is_healthy and not is_accepted:
            raise serializers.ValidationError({"detail": "Patient must be accepted if healthy"})
        return data
        

    def create(self, validated_data):
        is_accepted = validated_data.get('is_accepted', None)
        instance = PatientHealthReview.objects.create(**validated_data)
        if is_accepted is not None:
            user_status = instance.user.status
            if is_accepted:
                user_status.process = UserStatus.Process.PAYMENT
                user_status.status = UserStatus.Status.PENDING
            else:
                user_status.process = UserStatus.Process.VISIT
                user_status.status = UserStatus.Status.REJECTED
                try:
                    promote_backup(user = instance.user)
                except Exception as e:
                    print(e)
                    
            user_status.save()
        return instance

