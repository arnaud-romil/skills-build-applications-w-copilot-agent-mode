
from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Workout, Leaderboard
from django.utils import timezone
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        # Nettoyage direct via pymongo pour éviter les problèmes de suppression en cascade Djongo
        client = MongoClient('mongodb://localhost:27017')
        db = client['octofit_db']
        db.activity.delete_many({})
        db.workout.delete_many({})
        db.leaderboard.delete_many({})
        db.user.delete_many({})
        db.team.delete_many({})

        # Teams
        marvel = Team.objects.create(name='Team Marvel', universe='Marvel')
        dc = Team.objects.create(name='Team DC', universe='DC')

        # Users (super héros)
        tony = User.objects.create(email='tony@stark.com', username='Iron Man', team=marvel, is_leader=True)
        steve = User.objects.create(email='steve@rogers.com', username='Captain America', team=marvel)
        bruce = User.objects.create(email='bruce@wayne.com', username='Batman', team=dc, is_leader=True)
        clark = User.objects.create(email='clark@kent.com', username='Superman', team=dc)

        # Activities
        Activity.objects.create(user=tony, type='Course', duration=30, date=timezone.now())
        Activity.objects.create(user=steve, type='Natation', duration=45, date=timezone.now())
        Activity.objects.create(user=bruce, type='Cyclisme', duration=60, date=timezone.now())
        Activity.objects.create(user=clark, type='Course', duration=50, date=timezone.now())

        # Workouts
        w1 = Workout.objects.create(name='HIIT', description='Entraînement fractionné de haute intensité')
        w2 = Workout.objects.create(name='Yoga', description='Séance de yoga pour la récupération')
        w1.suggested_for.set([tony, bruce])
        w2.suggested_for.set([steve, clark])

        # Leaderboard
        Leaderboard.objects.create(team=marvel, total_points=150, rank=1)
        Leaderboard.objects.create(team=dc, total_points=120, rank=2)

        self.stdout.write(self.style.SUCCESS('octofit_db a été peuplée avec des données de test.'))
