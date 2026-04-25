from rest_framework.response import Response
from .models import Category, Product, Wishlist
from .serializers import CartItemSerializer, OrderSerializer, Productserializer,Categoryserializer, WishlistSerializer
from django.shortcuts import get_object_or_404
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsOwner
from rest_framework.decorators import api_view,permission_classes
from .models import Cart, CartItem, Product

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = Productserializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Product.objects.all()
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_serializer_context(self):
        return {'request': self.request}

class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = Productserializer
    permission_classes = [IsAuthenticated,IsOwner]
    def get_queryset(self):
        return Product.objects.filter(user=self.request.user)

class CategoryListView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = Categoryserializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    user = request.user
    product_id = request.data.get("product_id")
    product = get_object_or_404(Product, id=product_id)
    cart, created = Cart.objects.get_or_create(user=user)
    item = CartItem.objects.filter(
        cart=cart,
        product=product
    ).first()
    if item:
        item.quantity += 1
        item.save()
    else:
        item = CartItem.objects.create(
            cart=cart,
            product=product,
            quantity=1
        )
    return Response({
        "message":"Product added",
        "quantity": item.quantity
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    print("CURRENT USER:", request.user)
    user = request.user
    cart = Cart.objects.filter(user=user).first()
    if not cart:
        return Response([])
    items = CartItem.objects.filter(cart=cart)
    serializer = CartItemSerializer(items, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, item_id):
    user = request.user
    cart = Cart.objects.filter(user=user).first()
    if not cart:
        return Response({"error": "Cart not found"})
    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    cart_item.delete()
    return Response({"message": "Item removed from cart"})

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_cart_item(request, item_id):
    user = request.user
    cart = get_object_or_404(Cart, user=user)
    if not cart:
        return Response({"error": "Cart not found"})

    cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
    if request.method == 'DELETE':
        cart_item.delete()
        return Response({"message": "Item removed from cart"})
    quantity = request.data.get('quantity')
    if quantity is None:
        return Response({"error": "Quantity is required"})
    if int(quantity) <= 0:
        cart_item.delete()
        return Response({"message": "Item removed from cart"})

    cart_item.quantity = quantity
    cart_item.save()

    return Response({
        "message": "Quantity updated",
        "quantity": cart_item.quantity
    })

from .models import Order, OrderItem


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    cart = get_object_or_404(Cart, user=user)
    if not cart:
        return Response({"error": "Cart is empty"})
    cart_items = CartItem.objects.filter(cart=cart)
    if not cart_items.exists():
        return Response({"error": "Cart is empty"})
    total_price = 0
    for item in cart_items:
        total_price += item.product.price * item.quantity
    order = Order.objects.create(
        user=user,
        total_price=total_price,
        
    )
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            quantity=item.quantity,
            price=item.product.price
        )
    cart_items.delete()

    return Response({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_price": total_price
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_orders(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')
    serializer = OrderSerializer(orders, many=True, context={'request':request})
    return Response(serializer.data)

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class WishlistDeleteView(generics.DestroyAPIView):
    queryset = Wishlist.objects.all()
    permission_classes = [IsAuthenticated]

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_status(request, order_id):
    order = get_object_or_404(Order, id=order_id)

    status = request.data.get("status")

    if status not in ["pending", "shipped", "delivered"]:
        return Response({"error": "Invalid status"})

    order.status = status
    order.save()

    return Response({
        "message": "Status updated",
        "status": order.status
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)

    if order.status == "delivered":
        return Response({"error": "Cannot cancel delivered order"})

    order.status = "cancelled"
    order.save()

    return Response({"message": "Order cancelled"})