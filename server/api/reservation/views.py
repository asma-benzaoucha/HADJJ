from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import Reservation, Flight, Hotel, Room, Airport
from .serializers import ReservationSerializer, FlightSerializer, HotelSerializer, RoomSerializer
from users.models import UserStatus
from django.db.models import Q

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def does_user_have_reservation(request):
    try:
        reservation = Reservation.objects.get(user=request.user)
        serializer = ReservationSerializer(reservation)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Reservation.DoesNotExist:
        return Response({'has_reservation': False}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_flights(request):
    user_wilaya = request.user.personal_profile.wilaya 
    print(user_wilaya)
    flights = Flight.objects.filter(airport__associated_wilayas=user_wilaya.id)
    serializer = FlightSerializer(flights, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def reserve_flight(request):
#     flight_id = request.data.get('flight_id')
#     try:
#         flight = Flight.objects.get(id=flight_id)
#     except Flight.DoesNotExist:
#         return Response({'message': 'Flight not found'}, status=status.HTTP_404_NOT_FOUND)

#     if flight.available_seats > 0:
#         reservation = Reservation.objects.create(user=request.user, flight=flight)
#         flight.available_seats -= 1
#         flight.save()
#         serializer = ReservationSerializer(reservation)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     else:
#         return Response({'message': 'No available seats for this flight'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_all_hotels_and_rooms(request):
    user = request.user
    user_wilaya = user.personal_profile.wilaya
    hotels = Hotel.objects.filter(flight__airport__associated_wilayas=user_wilaya.id)
    serializer = HotelSerializer(hotels, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def reserve_room(request):
#     room_id = request.data.get('room_id')
#     try:
#         room = Room.objects.get(id=room_id)
#     except Room.DoesNotExist:
#         return Response({'message': 'Room not found'}, status=status.HTTP_404_NOT_FOUND)

#     if room.available_beds > 0:
#         reservation = Reservation.objects.get(user=request.user)
#         reservation.room = room
#         reservation.save()
#         room.available_beds -= 1
#         room.save()
#         serializer = ReservationSerializer(reservation)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     else:
#         return Response({'message': 'No available beds in this room'}, status=status.HTTP_400_BAD_REQUEST)
    


@api_view(["POST"])
def reserve(request):
    flight_id = request.data.get("flight_id")
    rooms_id = request.data.get("rooms_id")
    if not flight_id or not rooms_id:
        return Response({"success":False,"message": "Missing flight_id or rooms_id"}, status=status.HTTP_400_BAD_REQUEST)
    try:
        flight = Flight.objects.get(id=flight_id)
    except Flight.DoesNotExist:
        return Response({"success":False,"message": "Flight not found"}, status=status.HTTP_404_NOT_FOUND)
    gender = request.user.gender
    required_seats = 1 if gender == "M" else 2
    if flight.available_seats < required_seats:
        return Response({"success":False,"message": "No available seats for this flight"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        rooms = Room.objects.filter(id__in=rooms_id)
    except Room.DoesNotExist:
        return Response({"success":False,"message": "Room not found"}, status=status.HTTP_404_NOT_FOUND)
    print(request.data)
    if len(rooms) != len(rooms_id):
        return Response({"success":False,"message": "Some rooms not found"}, status=status.HTTP_404_NOT_FOUND)

    for room in rooms:
        if room.available_beds < 1:
            return Response({"success":False,"message": "No available beds in this room"}, status=status.HTTP_400_BAD_REQUEST)
        room.available_beds -= 1
        room.save()
    reservation = Reservation.objects.create(user=request.user, flight=flight)
    reservation.rooms.set(rooms)
    flight.available_seats -= required_seats
    flight.save()
    reservation.save()
    user = request.user
    user_status = UserStatus.objects.get(user = user)
    user_status.status = UserStatus.Status.CONFIRMED
    user_status.save()
    
    return Response({"success":True,"message": "Reservation created successfully"}, status=status.HTTP_201_CREATED)
