from django.contrib import admin
from django.urls import path, include # <--- ΜΗΝ ΞΕΧΑΣΕΙΣ το include

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Όλα τα URLs του API θα ξεκινάνε με 'api/'
    path('api/', include('office.urls')), 
]