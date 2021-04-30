from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime
import random
import string

class Book(models.Model):
    title = models.CharField(max_length=120)
    author = models.CharField(max_length=120)
    year = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(int(datetime.datetime.now().year))])
    in_stock = models.BooleanField()
    pages = models.IntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return self.title



