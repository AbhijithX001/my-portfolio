from django.contrib import admin

from .models import ContactMessage, Project, Resume, Service, SocialMedia


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "link")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "subject", "created_at")
    search_fields = ("full_name", "email", "subject")


@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ("platform", "link")
    list_filter = ("platform",)


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ("file", "uploaded_at")
