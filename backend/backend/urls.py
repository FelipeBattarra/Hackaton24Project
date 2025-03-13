from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from core import views as core_views

router = routers.DefaultRouter()
router.register(r'users', core_views.UserViewSet)
router.register(r'groups', core_views.GroupViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('auth/', include('knox.urls')),
    path('form/get-all-questions/', core_views.get_all_questions),
    path('form/submit-answers/', core_views.submit_answers),
    path('form/get-user-submissions/', core_views.get_user_submissions),
    path('user/get-user-info/', core_views.get_user_info),
    path('user/save-cep/', core_views.save_cep),
    path('gpt/get-advice/', core_views.get_advice),
    path('geo/get-happiness/', core_views.get_happiness),
]
