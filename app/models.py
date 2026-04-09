from django.db import models

SOCIAL_PLATFORM_CHOICES = [
    ("github", "GitHub"),
    ("linkedin", "LinkedIn"),
    ("instagram", "Instagram"),
    ("twitter", "X (Twitter)"),
    ("facebook", "Facebook"),
    ("youtube", "YouTube"),
    ("email", "Email"),
    ("website", "Website"),
]


class Service(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField()

    def __str__(self):
        return self.name


class Project(models.Model):
    name = models.CharField(max_length=150, default="")
    image = models.FileField(upload_to="projects/")
    description = models.TextField()
    link = models.URLField()

    def __str__(self):
        return self.name or self.description[:40]


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone_number = models.CharField(max_length=30)
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"


class SocialMedia(models.Model):
    platform = models.CharField(
        max_length=30,
        choices=SOCIAL_PLATFORM_CHOICES,
        default="github",
    )
    link = models.URLField()

    def __str__(self):
        return self.get_platform_display()


class Resume(models.Model):
    file = models.FileField(upload_to="resumes/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.file.name
