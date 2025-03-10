# Generated by Django 4.2.16 on 2024-10-15 18:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("products", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="country",
            name="description",
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="product",
            name="image",
            field=models.ImageField(blank=True, null=True, upload_to="product_images/"),
        ),
    ]
