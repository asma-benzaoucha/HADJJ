from django.db import transaction
from rest_framework import serializers
from .models import PilgrimageSeasonInfo, Phase
from municipal_wilaya.serializers import SeatsSerializer
from municipal_wilaya.models import Wilaya, Seats



class PhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phase
        fields = ['phase_number', 'start_date', 'end_date']
        
        
class  AllPilgrimageSeasonInfoSerializer(serializers.ModelSerializer):
    phases = PhaseSerializer(many=True, required=True)
    class Meta:
        model = PilgrimageSeasonInfo
        fields = ['year','is_active' ,'total_pilgrims', 'inscription_deadline','price' ,'procedure_deadline', 'phases']
        extra_kwargs = {
            # 'ratio' : {'read_only': True},
            'is_active' : {'read_only': True},
        }  

class CurrentPilgrimageSeasonInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PilgrimageSeasonInfo
        fields = ['year','is_active' ,'total_pilgrims', 'inscription_deadline','price' ,'procedure_deadline']
        extra_kwargs = {
            # 'ratio' : {'read_only': True},
            'is_active' : {'read_only': True},
        }
class  PilgrimageSeasonInfoSerializer(serializers.ModelSerializer):
    phases = PhaseSerializer(many=True, required=True)
    class Meta:
        model = PilgrimageSeasonInfo
        fields = ['year','is_active' ,'total_pilgrims', 'inscription_deadline','price' ,'procedure_deadline', 'phases', 'wilayas_seats']
        extra_kwargs = {
            # 'ratio' : {'read_only': True},
            'is_active' : {'read_only': True},
            'wilayas_seats': {'write_only': True},
        }
    wilayas_seats = SeatsSerializer(many=True, required=True)   
    
    def validate(self, attrs):
        if PilgrimageSeasonInfo.objects.filter(is_active=True).exists():
            raise serializers.ValidationError('There is already an active season')
        
        return attrs
    
    

    def validate_wilaya(self, wilaya , wilayas_ids):
        # Use the loaded set to validate the wilaya ID
        if wilaya.id not in wilayas_ids:
            raise serializers.ValidationError({"msg": f"The wilaya {wilaya.id} does not exist."})
        
    
    def create(self, validated_data):
        with transaction.atomic():
            phases_data = validated_data.pop('phases', [])
            wilayas_seats = validated_data.pop('wilayas_seats', [])
            pilgrimage_season_info = PilgrimageSeasonInfo.objects.create(**validated_data)
            
            all_wilaya_ids = set(Wilaya.objects.values_list('id', flat=True))
            # print(all_wilaya_ids)
            # print(wilayas_seats)
            for seat_data in wilayas_seats:
                self.validate_wilaya(seat_data['wilaya'], all_wilaya_ids)
                seat_data['season'] = pilgrimage_season_info
                Seats.objects.create(**seat_data)
            
            for phase_data in phases_data:
                Phase.objects.create(pilgrimage_season_info=pilgrimage_season_info, **phase_data)
               
            return pilgrimage_season_info