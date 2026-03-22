import uuid
from django.db import models
from django.utils import timezone
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.translation import gettext_lazy as _
from baseuser.models import BaseUser
from courses.models import Course, Lesson
from datetime import timedelta

# ─────────────────────────────────────────────
#  TEST MODEL
# ─────────────────────────────────────────────

class Test(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.SET_NULL,
        related_name="tests",
        blank=True,
        null=True
    )
    title = models.CharField("Test nomi", max_length=255)
    duration_minutes = models.PositiveIntegerField("Davomiyligi (daqiqa)", default=60)
    question_count = models.PositiveIntegerField("Savollar soni", default=20)
    max_attempts = models.PositiveIntegerField(
        "Maksimal urinishlar soni (0 = cheksiz)", default=0)
    access_code = models.CharField(
        "Kirish kodi (bo'sh = ochiq)", max_length=50, blank=True, null=True)
    is_active = models.BooleanField("Faol", default=True)
    deadline = models.DateTimeField(
        "Testning tugash muddati", 
        help_text="Ushbu vaqtdan keyin testni boshlab bo'lmaydi"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    @property
    def is_available(self):
        """Test hali ochiqmi va muddati o'tmadimi?"""
        return self.is_active and self.deadline > timezone.now()


    @property
    def global_time_left(self):
        """Test yopilishiga (deadlinega) qancha qoldi"""
        remaining = self.deadline - timezone.now()
        return max(int(remaining.total_seconds()), 0)
    class Meta:
        verbose_name = "📝 Test"
        verbose_name_plural = "📑 Testlar"
        # Muddati yaqin qolgan testlarni birinchi ko'rsatish
        ordering = ["deadline"] 

    def __str__(self):
        return f"test — {self.title}"


# ─────────────────────────────────────────────
#  QUESTION & CHOICE
# ─────────────────────────────────────────────

class Question(models.Model):
    DIFFICULTIES = [('easy', 'Oson'), ('medium', "O'rtacha"), ('hard', 'Qiyin')]

    test = models.ForeignKey(
        Test, on_delete=models.CASCADE, 
        related_name="questions", verbose_name="Test"
    )
    difficulty = models.CharField(max_length=10, choices=DIFFICULTIES, default='easy')
    xp = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(1), MaxValueValidator(600)],
        help_text=_("Bo'sh qolsa: Oson-10, O'rtacha-25, Qiyin-50 ball beriladi."),
        verbose_name="XP"
    )
    text = models.TextField("Savol matni")
    image = models.ImageField("Rasm", upload_to="questions/", blank=True, null=True)
    order = models.PositiveIntegerField("Tartib raqami", default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.xp or self.xp == 0:
            xp_map = {'easy': 10, 'medium': 25, 'hard': 50}
            self.xp = xp_map.get(self.difficulty, 10)
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "❓ Savol"
        verbose_name_plural = "❔ Savollar"
        ordering = ["test", "order"]

class Choice(models.Model):
    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, 
        related_name="choices"
    )
    text = models.CharField("Javob matni", max_length=500)
    is_correct = models.BooleanField("To'g'ri javob", default=False)
    order = models.PositiveIntegerField("Tartib", default=0)

    class Meta:
        verbose_name = "🔘 Javob varianti"
        verbose_name_plural = "✅ Javob variantlari"
        ordering = ["question", "order"]

# ─────────────────────────────────────────────
#  TEST SESSION & ANSWERS
# ─────────────────────────────────────────────

class TestSession(models.Model):
    class Status(models.TextChoices):
        IN_PROGRESS = "in_progress", "Jarayonda"
        COMPLETED   = "completed",   "Yakunlangan"
        EXPIRED     = "expired",     "Muddati o'tgan"

    user = models.ForeignKey(BaseUser, on_delete=models.CASCADE, related_name="test_sessions")
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="sessions")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.IN_PROGRESS)
    
    # Natijalar (Keshlab ketish uchun)
    score = models.PositiveIntegerField("To'g'ri javoblar", default=0)
    total_questions = models.PositiveIntegerField("Jami savollar", default=0)
    percentage = models.DecimalField("Foiz", max_digits=5, decimal_places=2, default=0.00)
    total_xp_earned = models.PositiveIntegerField("To'plangan XP", default=0)
    
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField("Tugash vaqti", null=True, blank=True)
    finish =  models.DateTimeField("Foydalnovchi tugatgan vaqti", null=True, blank=True)
    certificate_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    @property
    def is_expired(self):
        """Hozirgi vaqt belgilangan ended_at dan o'tib ketganmi?"""
        # Agar status jarayonda bo'lmasa yoki ended_at hali belgilanmagan bo'lsa
        if self.status != self.Status.IN_PROGRESS or self.ended_at is None:
            return False
        return timezone.now() > self.ended_at
    @property
    def time_left(self):
        """Aynan shu sessiya tugashiga qancha qoldi (60 daqiqa ichidan)"""
        if self.ended_at:
            remaining = self.ended_at - timezone.now()
            return max(int(remaining.total_seconds()), 0)
        return 0
    def calculate_results(self):
        """Natijalarni jamlash va statusni yangilash"""
        answers = self.answers.all()
        correct_count = answers.filter(is_correct=True).count()
        total_xp = sum(a.question.xp for a in answers.filter(is_correct=True))
        
        self.score = correct_count
        self.total_xp_earned = total_xp
        if self.total_questions > 0:
            self.percentage = (correct_count / self.total_questions) * 100
        
        self.status = self.Status.COMPLETED
        self.ended_at = timezone.now()
        self.save()

    class Meta:
        verbose_name = "⏱️ Test sessiyasi"
        verbose_name_plural = "📊 Test sessiyalari"

class UserAnswer(models.Model):
    session = models.ForeignKey(TestSession, on_delete=models.CASCADE, related_name="answers")
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.SET_NULL, null=True, blank=True)
    is_correct = models.BooleanField(default=False) # Analitika uchun kesh
    answered_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("session", "question")

    def save(self, *args, **kwargs):
        if self.choice:
            self.is_correct = self.choice.is_correct
        super().save(*args, **kwargs)

# ─────────────────────────────────────────────
#  CERTIFICATE SYSTEM
# ─────────────────────────────────────────────

class CertificateTemplate(models.Model):
    name = models.CharField("Shablon nomi", max_length=200)
    course = models.OneToOneField(
        Course, on_delete=models.CASCADE, 
        related_name="certificate_template"
    )
    background_image = models.ImageField("Fon rasmi", upload_to="cert_templates/")
    min_percentage = models.DecimalField(
        "Minimal foiz (%)", max_digits=5, decimal_places=2, default=60.00
    )
    # Sertifikatda chiqadigan matnlar uchun (koordinatalar kabi)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "📜 Sertifikat shabloni"
        verbose_name_plural = "🎨 Sertifikat shablonlari"
