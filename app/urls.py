from django.urls import path

from . import views

urlpatterns = [
    path("services/", views.service_list, name="service-list"),
    path("projects/", views.project_list, name="project-list"),
    path("social-media/", views.social_media_list, name="social-media-list"),
    path("resume/", views.latest_resume, name="latest-resume"),
    path("contact/", views.create_contact_message, name="create-contact-message"),
]
