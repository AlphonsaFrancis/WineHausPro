from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()

def send_low_stock_notification(product):
    """
    Send email notification to suppliers when stock is low
    """
    suppliers = User.objects.filter(is_supplier=True)
    subject = f'Low Stock Alert: {product.name}'
    message = f'''
    Dear Supplier,

    This is to notify you that the following product is running low on stock:

    Product: {product.name}
    Current Stock: {product.stock_quantity}
    Minimum Threshold: {product.min_stock_threshold}
    
    Please take necessary action to replenish the stock.

    Best regards,
    WineHaus Team
    '''
    
    recipient_list = [supplier.email for supplier in suppliers]
    
    if recipient_list:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
        ) 