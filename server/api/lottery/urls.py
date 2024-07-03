from django.urls import path
from .views import (
    # participate_in_lottery,
    lottery_algorithm,
    statistics,
    launch_lottery,
    reset_lottery,
    is_lottery_done,
    lotter_participants,
    get_municipals_data,
    get_all_winners_reserve
)

urlpatterns = [
    # path('', participate_in_lottery),
    path('', is_lottery_done),
    path('algorithm', lottery_algorithm),
    path('statistics', statistics),
    path('result', launch_lottery),
    path("participants", lotter_participants, name=""),
    path('reset', reset_lottery),
    path('municipals', get_municipals_data),
    path('winners', get_all_winners_reserve)
    
    # path('v2/statistics', optimized_statistics),
]