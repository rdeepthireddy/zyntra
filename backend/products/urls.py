from django.urls import path
from .views import CategoryListView, ProductDetailView, ProductListCreateView, WishlistDeleteView, WishlistListCreateView, add_to_cart, cancel_order, place_order, remove_from_cart, update_cart_item, update_order_status, view_cart,view_orders
urlpatterns = [
    path('products/', ProductListCreateView.as_view()),
    path('products/<int:pk>/', ProductDetailView.as_view()),
    path('categories/', CategoryListView.as_view()),
    path('cart/add/',add_to_cart),
    path('cart/', view_cart),
    path('cart/remove/<int:item_id>/', remove_from_cart),
    path('cart/update/<int:item_id>/', update_cart_item),
    path('order/place/', place_order),
    path('orders/', view_orders),
    path('wishlist/', WishlistListCreateView.as_view()),
    path('wishlist/<int:pk>/', WishlistDeleteView.as_view()),
    path('order/cancel/<int:order_id>/', cancel_order),
]