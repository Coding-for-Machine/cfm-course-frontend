from django.contrib import admin
from django.db import models
from unfold.admin import ModelAdmin, TabularInline
from unfold.contrib.forms.widgets import WysiwygWidget # Vizual muharrir
from .models import Contest, ContestRegistration

class ContestRegistrationInline(TabularInline):
    model = ContestRegistration
    extra = 0 # Bo'sh qator ko'rsatmaslik
    autocomplete_fields = ["user"]
    fields = ["user", "total_score", "rank", "is_active"]
    tab = True

@admin.register(Contest)
class ContestAdmin(ModelAdmin):
    # Ro'yxat ko'rinishi (List View)
    list_display = [
        "title", 
        "status", 
        "type", 
        "difficulty", 
        "start_time", 
        "is_featured"
    ]
    list_filter = ["status", "type", "difficulty", "is_featured"]
    search_fields = ["title", "description"]
    list_editable = ["status", "is_featured"]
    
    # ✅ Hamma TextField lar uchun Unfold ning Vizual Muharriri
    # Bu orqali description va prizes ichida rasm, link va formatlash mumkin bo'ladi
    formfield_overrides = {
        models.TextField: {
            "widget": WysiwygWidget,
        },
    }

    # Inline ulanishi
    inlines = [ContestRegistrationInline]

    # Ma'lumotlarni guruhlash (Layout)
    fieldsets = (
        ("📌 Asosiy Ma'lumotlar", {
            "fields": (
                ("title", "category"),
                "description", # WysiwygWidget ishlaydi
                "is_featured",
            )
        }),
        ("⏰ Vaqt va Davomiylik", {
            "fields": (
                ("start_time", "end_time"),
                "duration",
            ),
        }),
        ("⚙️ Sozlamalar va Kirish", {
            "fields": (
                ("type", "status", "difficulty"),
                ("max_participants", "access_key"),
            ),
        }),
        ("🏆 Mukofotlar va Sovg'alar", {
            "fields": ("prizes",), # JSON muharriri yoki Text
            "classes": ["collapse"], # Odatiy holatda yopiq turadi
        }),
    )

    # Avtomatik slug yoki boshqa maydonlar uchun
    # prepopulated_fields = {"slug": ("title",)} # Agar modelda slug bo'lsa

# Ro'yxatdan o'tishlar uchun alohida admin
@admin.register(ContestRegistration)
class ContestRegistrationAdmin(ModelAdmin):
    list_display = ["user", "contest", "total_score", "rank", "is_active"]
    search_fields = ["user__username", "contest__title"]
    list_filter = ["contest", "is_active"]
    autocomplete_fields = ["user", "contest"]
