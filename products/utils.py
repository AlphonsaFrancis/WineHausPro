from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.utils.html import strip_tags

User = get_user_model()

def send_low_stock_notification(product):
    """
    Send email notification to suppliers when stock is low
    """
    suppliers = User.objects.filter(is_supplier=True)
    
    # Prepare the email content using the template
    html_message = render_to_string('email/low_stock_notification.html', {
        'product': product,
        'login_url': 'http://localhost:3000/login'  # Add your frontend login URL
    })
    
    # Strip HTML tags for plain text version
    plain_message = strip_tags(html_message)
    
    subject = f'Low Stock Alert: {product.name}'
    
    recipient_list = [supplier.email for supplier in suppliers]
    
    if recipient_list:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
            html_message=html_message
        ) 