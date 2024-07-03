from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
# from rest_framework.authentication import IsA
from rest_framework.permissions import IsAuthenticated

from roles.roles import IsGeneralAdminUser, IsGeneralAdminOrAdminUser, IsAdminUser
from rest_framework import status
from .models import PilgrimageSeasonInfo
from .serializers import PilgrimageSeasonInfoSerializer, AllPilgrimageSeasonInfoSerializer, CurrentPilgrimageSeasonInfoSerializer
from datetime import datetime, timedelta, date

@api_view(['POST'])
# @permission_classes([IsGeneralAdminUser])
def create_pilgrimage_season_info(request):
    serializer = PilgrimageSeasonInfoSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'success':True}, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['GET'])
# @permission_classes([IsAuthenticated])
def get_current_season(request):
    try:
        current_season = PilgrimageSeasonInfo.objects.get(is_active=True)
    except PilgrimageSeasonInfo.DoesNotExist:
        return Response({'error': 'No active season'}, status=status.HTTP_404_NOT_FOUND)

    serializer = CurrentPilgrimageSeasonInfoSerializer(current_season)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_seasons(request):
    
    seasons = PilgrimageSeasonInfo.objects.all().order_by('-year')
    

    serializer = AllPilgrimageSeasonInfoSerializer(seasons, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsGeneralAdminUser])
def mark_season_as_finished(request):
    # 
    try:
        season = PilgrimageSeasonInfo.objects.get(is_active=True)
    except PilgrimageSeasonInfo.DoesNotExist:
        return Response({'error': 'no active season'}, status=status.HTTP_404_NOT_FOUND)
    
    now = datetime.now().date()
    procedure_deadline_plus_30_days = season.procedure_deadline + timedelta(days=30)
    print(procedure_deadline_plus_30_days, now)
    
    if now < procedure_deadline_plus_30_days:
        return Response({'message': f'Cannot finish season until {procedure_deadline_plus_30_days}.'}, status=status.HTTP_200_OK)
   
    season.is_active = False
    season.save()
    return Response({'success': True}, status=status.HTTP_200_OK)