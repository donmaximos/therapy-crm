from django.contrib import admin
from django.urls import path, include # <--- ΜΗΝ ΞΕΧΑΣΕΙΣ το include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Όλα τα URLs του API θα ξεκινάνε με 'api/'
    path('api/', include('office.urls')), 

    #urls login
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Εδώ κάνεις Login
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Εδώ ανανεώνεις το token
]