# Generated by Django 5.1.3 on 2025-02-02 09:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0014_transactions_userwallet'),
    ]

    operations = [
        migrations.AddField(
            model_name='transactions',
            name='transaction_desc',
            field=models.CharField(default=None, max_length=255, null=True),
        ),
    ]
