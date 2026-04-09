import json

from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .models import ContactMessage, Project, Resume, Service, SocialMedia


def home(request):
    return render(request, "index.html")


def _build_file_url(request, file_field):
    if not file_field:
        return None
    return request.build_absolute_uri(file_field.url)


@require_GET
def service_list(request):
    services = Service.objects.all().values("id", "name", "description")
    return JsonResponse(list(services), safe=False)


@require_GET
def project_list(request):
    projects = []
    for project in Project.objects.all():
        projects.append(
            {
                "id": project.id,
                "name": project.name,
                "image": _build_file_url(request, project.image),
                "description": project.description,
                "link": project.link,
            }
        )
    return JsonResponse(projects, safe=False)


@require_GET
def social_media_list(request):
    social_links = []
    for item in SocialMedia.objects.all():
        social_links.append(
            {
                "id": item.id,
                "platform": item.platform,
                "platform_label": item.get_platform_display(),
                "link": item.link,
            }
        )
    return JsonResponse(social_links, safe=False)


@require_GET
def latest_resume(request):
    resume = Resume.objects.order_by("-uploaded_at").first()
    if not resume:
        return JsonResponse({"resume": None})

    return JsonResponse(
        {
            "id": resume.id,
            "resume": _build_file_url(request, resume.file),
        }
    )


@csrf_exempt
@require_POST
def create_contact_message(request):
    data = request.POST.dict()

    if not data and request.body:
        try:
            data = json.loads(request.body.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return JsonResponse({"error": "Invalid JSON body"}, status=400)

    required_fields = ["full_name", "email", "phone_number", "subject", "message"]
    missing_fields = [field for field in required_fields if not data.get(field)]
    if missing_fields:
        return JsonResponse(
            {"error": f"Missing fields: {', '.join(missing_fields)}"},
            status=400,
        )

    contact = ContactMessage.objects.create(
        full_name=data["full_name"],
        email=data["email"],
        phone_number=data["phone_number"],
        subject=data["subject"],
        message=data["message"],
    )

    return JsonResponse(
        {"id": contact.id, "message": "Contact message submitted successfully"},
        status=201,
    )
