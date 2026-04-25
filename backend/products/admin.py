from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Category, Order, OrderItem, Product , Cart, CartItem
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(CartItem)
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['id', 'user__username']
    readonly_fields = ['total_price']  
    def has_add_permission(self, request):
        return False
@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'order', 'product', 'quantity', 'price']