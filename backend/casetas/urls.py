from rest_framework.routers import DefaultRouter
from django.urls import re_path, include
from casetas.views import (OrderViewset, 
                           LoginWithTeleviaView, 
                           UnitViewset,
                           CrucesView)

router = DefaultRouter()
router.register(r'ordenes', OrderViewset, basename='ordenes')
router.register(r'unidades', UnitViewset, basename='unidades')

urlpatterns = [
    re_path(r'^login$', LoginWithTeleviaView.as_view(), name='login_with_televia'),
    re_path(r'^cruces$', CrucesView.as_view(), name='cruces'),
    re_path('^', include(router.urls)),
]
