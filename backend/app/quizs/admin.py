from django.contrib import admin
from django.db import models
from unfold.admin import ModelAdmin, TabularInline, StackedInline
from unfold.contrib.forms.widgets import WysiwygWidget
from unfold.decorators import display
from .models import (
    Test, Question, Choice, TestSession, 
    UserAnswer, CertificateTemplate,
)

# ─────────────────────────────────────────────
#  INLINES (Ichma-ich tahrirlash)
# ─────────────────────────────────────────────

class ChoiceInline(TabularInline):
    model = Choice
    extra = 4  # Odatda 4 ta variant
    tab = True

class QuestionInline(StackedInline): # Savollar uzun bo'lgani uchun Stacked
    model = Question
    extra = 1
    tab = True
    show_change_link = True # Savolni alohida tahrirlashga o'tish tugmasi

# ─────────────────────────────────────────────
#  ADMIN CLASSES
# ─────────────────────────────────────────────

@admin.register(Test)
class TestAdmin(ModelAdmin):
    list_display = ["title", "lesson", "duration_minutes", "question_count", "is_active"]
    list_filter = ["is_active", "lesson", "created_at"]
    search_fields = ["title", "lesson__title"]
    list_editable = ["is_active"]
    
    # Savollarni testning o'zida qo'shish imkoniyati
    inlines = [QuestionInline]

    @display(description="Holat", label=True)
    def is_active_status(self, obj):
        return "Faol" if obj.is_active else "Nofaol"

@admin.register(Question)
class QuestionAdmin(ModelAdmin):
    list_display = ["display_header", "test", "order", "choices_count"]
    list_filter = ["test", "test__lesson"]
    search_fields = ["text"]
    inlines = [ChoiceInline]
    
    @display(header=True)
    def display_header(self, obj):
        return [obj.text[:50] + "...", f"ID: {obj.id}"]

    @display(description="Variantlar")
    def choices_count(self, obj):
        return f"{obj.choices.count()} ta"

@admin.register(TestSession)
class TestSessionAdmin(ModelAdmin):
    list_display = ["user", "test", "score_display", "percentage_label", "status_label", "started_at"]
    list_filter = ["status", "test"]
    readonly_fields = ["certificate_id", "started_at"]
    
    @display(description="Natija", header=True)
    def score_display(self, obj):
        return [f"{obj.score} / {obj.total_questions}", "To'g'ri javoblar"]

    @display(description="Foiz", label=True)
    def percentage_label(self, obj):
        return f"{obj.percentage}%"

    @display(description="Holat", label={
        "in_progress": "info",
        "completed": "success",
        "expired": "danger",
    })
    def status_label(self, obj):
        return obj.get_status_display()

@admin.register(CertificateTemplate)
class CertificateTemplateAdmin(ModelAdmin):
    list_display = ["name", "course", "min_percentage"]
    
    # ✅ HTML shablon uchun Unfold vizual muharriri
    formfield_overrides = {
        models.TextField: {
            "widget": WysiwygWidget,
        },
    }

admin.site.register(UserAnswer)
