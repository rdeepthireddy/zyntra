from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Product,Category, Wishlist
from .models import CartItem
from .models import Order, OrderItem

class Categoryserializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class Productserializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name',read_only=True)
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'price',
            'image',
            'category',
            'category_name',
            'rating',
            'discount',
            'in_stock',
            'fast_delivery'
        ]
    def get_image(self, obj):
        request = self.context.get('request')
        if obj.image:
            return request.build_absolute_uri(obj.image.url)
        return None
  

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name',read_only=True)
    product_image = serializers.SerializerMethodField()
    price = serializers.FloatField(source='product.price')

    class Meta:
        model = CartItem
        fields = ['id','product','product_name','product_image','price','quantity']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return None
    

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name' , 'product_image','quantity', 'price']
    
    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer( many=True)
    class Meta:
        model = Order
        fields = ['id', 'total_price', 'created_at', 'status', 'items']

class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.SerializerMethodField()
    price = serializers.FloatField(source='product.price', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_name', 'product_image','price']

    def get_product_image(self, obj):
        request = self.context.get('request')
        if obj.product.image:
            return request.build_absolute_uri(obj.product.image.url)
        return None