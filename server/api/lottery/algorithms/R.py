from pilgrimage_info.models import PilgrimageSeasonInfo
from municipal_wilaya.models import Municipal
from users.models import User, UserStatus, UserInscriptionHistory

from lottery.models import ParticipantStatusPhase
import random
from .util import winner_data
from municipal_wilaya.models import Seats


# this algorithm does not take into account the age of the participants
def _registration_priority(municipals, wilaya, _, used_seats):
    season = PilgrimageSeasonInfo.objects.get(is_active=True)
    # ratio = season.ratio
    winners = []
    backup = []
    # for the winners

    participants_ids = list(
        ParticipantStatusPhase.objects.filter(
            participant__personal_profile__municipal__in=municipals,
            participant__status__status=UserStatus.Status.PENDING.value,
            participant__status__process=UserStatus.Process.LOTTERY.value,
        ).values_list("participant", flat=True)
    )
    participants_weighted_ids = []
    for participant in participants_ids:
        inscription_count = max(
            UserInscriptionHistory.objects.get(user=participant).inscription_count,
            1,
        )
        participants_weighted_ids.extend([participant] * inscription_count)

    # shuffle the participants
    random.shuffle(participants_weighted_ids)

    # available seats
    municipals_population = sum(
        list(
            Municipal.objects.filter(id__in=municipals).values_list(
                "population", flat=True
            )
        )
    )
    wilaya_population = sum(
        list(
            Municipal.objects.filter(wilaya=wilaya).values_list("population", flat=True)
        )
    )

    wilaya_seats = Seats.objects.get(wilaya=wilaya, season=season)

    seats = round(
        wilaya_seats.available_seats
        * 0.01
        * ((100 * municipals_population) / wilaya_population)
    )
    
    seats+=used_seats

    y,i=select_winners(
        non_duplicate_list=participants_ids,
        participants_ids=participants_weighted_ids,
        seats=seats,
        process=UserStatus.Process.VISIT.value,
        status=UserStatus.Status.PENDING.value,
        result_list=winners,
    )
    print("y",y)
    print("i",i)
    participants_ids.append(y)
    for _ in range(i):
        participants_weighted_ids.append(y)


    # # get the backup
    backup_seats = round(seats * 0.5)
    print(backup_seats)
    y,i=select_winners(
        non_duplicate_list=participants_ids,
        participants_ids=participants_weighted_ids,
        seats=backup_seats,
        process=UserStatus.Process.LOTTERY.value,
        status=UserStatus.Status.IN_RESERVE.value,
        result_list=backup,
    )
    participants_ids.append(y)
    for _ in range(i):
        participants_weighted_ids.append(y)
    try:
        print(participants_ids)
        UserStatus.objects.filter(user__in = participants_ids).update(status = UserStatus.Status.REJECTED.value)
        print("rejected", UserStatus.Status.REJECTED.value)
    except Exception as e:
        print(f"error {e}")

    result = {
        "total_winners": seats,
        "winners": winners,
        "backup": backup,
    }
    return result


def select_winners(
    non_duplicate_list, participants_ids, seats, process, status, result_list
):

    while participants_ids and seats > 0:
        winner = random.choice(participants_ids)
        non_duplicate_list.remove(winner)
        i=0
        while winner in participants_ids:
            i+=1
            participants_ids.remove(winner)
        participant_status = UserStatus.objects.get(user=winner)

        # make sure the winner is not already a in the visit process
        if participant_status.process != UserStatus.Process.VISIT.value:
            participant = User.objects.get(id=winner)
            if participant.gender == "M" or (seats > 1):
                print("winner", winner)
                seats -= 1 if participant.gender == "M" else 2
                participant_status.process = process
                participant_status.status = status
                result_list.append(winner_data(participant))
                participant_status.save()
            # else:
            #     print("added code", winner)
            #     non_duplicate_list.append(winner)
            #     for _ in range(i):
            #         participants_ids.append(winner)
    return (winner, i)
