from django.shortcuts import render

def ext(request):
    return render(request, 'extjs/index.html')
