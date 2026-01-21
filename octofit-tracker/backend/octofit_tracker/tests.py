from django.test import TestCase
from .models import User, Team, Activity, Workout, Leaderboard

class ModelSmokeTests(TestCase):
    def test_team_creation(self):
        team = Team.objects.create(name="Test Team", universe="Test Universe")
        self.assertEqual(str(team), "Test Team")

    def test_user_creation(self):
        team = Team.objects.create(name="Team U", universe="U1")
        user = User.objects.create(email="user@test.com", username="user1", team=team)
        self.assertEqual(str(user), "user1")

    def test_activity_creation(self):
        team = Team.objects.create(name="Team A", universe="U2")
        user = User.objects.create(email="a@test.com", username="auser", team=team)
        activity = Activity.objects.create(user=user, type="run", duration=30, date="2024-01-01T10:00:00Z")
        self.assertIn("run", str(activity))

    def test_workout_creation(self):
        workout = Workout.objects.create(name="Cardio", description="Cardio session")
        self.assertEqual(str(workout), "Cardio")

    def test_leaderboard_creation(self):
        team = Team.objects.create(name="Team L", universe="U3")
        leaderboard = Leaderboard.objects.create(team=team, total_points=100, rank=1)
        self.assertIn("Rang", str(leaderboard))
