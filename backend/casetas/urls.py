from rest_framework.routers import DefaultRouter
from django.urls import re_path, include
from casetas.views import OrderViewset

router = DefaultRouter()
router.register(r'orden', OrderViewset, basename='orden')

urlpatterns = [
    re_path('^', include(router.urls)),
]
