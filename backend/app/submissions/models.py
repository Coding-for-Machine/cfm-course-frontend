from django.db import models
from problems.models import Language, Problem
from baseuser.models import BaseUser
from contests.models import Contest
# Create your models here.


class Submission(models.Model):
    user = models.ForeignKey(
        BaseUser, 
        on_delete=models.CASCADE,
        related_name='submissions'
    )
    problem = models.ForeignKey(
        Problem,
        on_delete=models.CASCADE,
        related_name='submissions'
    )

    contest = models.ForeignKey(
        Contest,
        on_delete=models.CASCADE,
        related_name='submissions',
        null=True,
        blank=True
    )

    # Kod va natijalar
    code = models.TextField()
    language = models.ForeignKey(
            Language,
            on_delete=models.PROTECT,
            related_name='submissions'
        )

    status = models.BooleanField(default=False)
    # Test case results
    test_results = models.JSONField(default=list, 
                                   help_text='[{"test_case": 1, "status": "passed", "time": 100}]')
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['user', 'problem', 'status']),
            models.Index(fields=['user', 'contest']),
            models.Index(fields=['status', 'submitted_at']),
            models.Index(fields=['contest', 'status']),
        ]
    def __str__(self):
        return f"{self.user.telegram_id} - {self.problem.title} - {self.status}"
