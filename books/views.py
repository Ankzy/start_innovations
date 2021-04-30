from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404

from .models import Book
from .serializers import BookSerializer


class BookViewSet(viewsets.ViewSet):

    def list(self, request):
        serializer = BookSerializer(Book.objects.all(), many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict()
        except AttributeError:
            data = request.data
        else:
            if data['in_stock'] == '1':
                data['in_stock'] = True
            elif data['in_stock'] == '0':
                data['in_stock'] = False
        serializer = BookSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.create(data)
        return Response(serializer.data)

    def retrieve(self, request, pk):
        serializer = BookSerializer(Book.objects.all().get(id=pk))
        return Response(serializer.data)

    def update(self, request, pk):
        book = get_object_or_404(Book.objects.all(), pk=pk)
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)

    def destroy(self, request, pk):
        book = get_object_or_404(Book.objects.all(), pk=pk)
        book.delete()
        return Response({
            "message": "Book with id `{}` has been deleted.".format(pk)
        }, status=200)
