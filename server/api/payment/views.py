from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Payment
from .serializers import PaymentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
import requests
from .extract_text import extract_textt
from users.models import UserStatus


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def validate_transaction(request):
#     data = request.data
#     serializer = PaymentSerializer(data=data)
#     if serializer.is_valid():
        
#         payment_details = serializer.validated_data

#         url = "http://localhost:8001/api/transactions/check"
#         response = requests.post(url, json=payment_details)

#         if response.status_code == 200:
#             serializer.save(user=request.user)
#             return Response({"success": True}, status=status.HTTP_200_OK)
#         else:
#             return Response({"error": f"External validation failed: {response.text}"}, status=status.HTTP_400_BAD_REQUEST)
        
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def validate_transaction(request):
    file = request.data.get('file')
    if not file:
        return Response({"error": "File is required"}, status=status.HTTP_400_BAD_REQUEST)
    user = request.user
    first_name = user.first_name
    last_name = user.last_name
    nin = user.personal_profile.nin
    
    keywords = ["First Name: ", "Last Name: ","NIN: " ,"Payment Code: "]
    values = [first_name, last_name, nin]
    print(file)
    
    try:
        results = extract_textt(file, keywords)
    except Exception as e:
        return Response({"error": f"Error extracting text from the document: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    for keyword in keywords[:3]:
        if results[keyword][0] != values[keywords.index(keyword)]:
            
            return Response({"error": f"Invalid {keyword} in the document"}, status=status.HTTP_400_BAD_REQUEST)
        
    
    payment_details = {
        "nin": nin,
        "first_name": first_name,
        "last_name": last_name,
        "payment_code":results[keywords[3]][0]
    }
    url = "http://localhost:8001/api/transactions/check"
    response = requests.post(url, json=payment_details)
    
    if response.status_code == 200:
        Payment.objects.create(user=user, payment_code=payment_details["payment_code"], file=file, is_paid=True)
        UserStatus.objects.filter(user=user).update(process= UserStatus.Process.RESERVATION)
        return Response({"success": True}, status=status.HTTP_200_OK)
    else:
        return Response({"error": f"External validation failed: {response.text}"}, status=status.HTTP_400_BAD_REQUEST)
    
    