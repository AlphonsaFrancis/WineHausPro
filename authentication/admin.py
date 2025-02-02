# from django.contrib import admin
# from .models import User,User_profile

# # Register your models here.
# admin.site.register(User)
# admin.site.register(User_profile)

from django.contrib import admin
from .models import Transactions, User,User_profile,OtpRecord,TempUser, UserWallet

# Register your models here.
admin.site.register(User)
admin.site.register(User_profile)
admin.site.register(OtpRecord)
admin.site.register(TempUser)
admin.site.register(UserWallet)
admin.site.register(Transactions)
