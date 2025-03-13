import brazilcep
from geopy.geocoders import Nominatim
from django import forms
from django.contrib.auth.models import Group
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, status
from core.models import Answer, FormSubmission, User, Question
from django.core.cache import cache
from gpt4all import GPT4All
from django.conf import settings

from core.serializers import UserSerializer, GroupSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


@api_view(['GET'])
def get_all_questions(request):
    questions = Question.objects.all().order_by('pk')
    questions_data = [
        {
            "id": question.pk, 
            "text": question.text
        } for question in questions
    ]
    return Response(questions_data)


@api_view(['POST'])
@transaction.atomic
def submit_answers(request):
    try:
        user = request.user
        answers_data = request.data
        
        form_submission = FormSubmission.objects.create(user=user)
        
        total_score = 0
        total_questions = len(answers_data)

        questions = Question.objects.all()
        questions_data = {question.pk: question for question in questions}
        
        with transaction.atomic():
            for answer_data in answers_data:
                question_id = answer_data['question']
                answer_value = answer_data['answer']
                
                question = questions_data[question_id]
                
                if question.reverse_scoring:
                    answer_value = 7 - answer_value
                
                Answer.objects.create(
                    form_submission=form_submission,
                    question=question,
                    user=user,
                    value=answer_value
                )
                
                total_score += answer_value
        
        final_score = total_score / total_questions
        
        form_submission.score = final_score
        form_submission.save(update_fields=['score'])
        
        return Response({"success": True, "score": final_score}, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_submissions(request):
    user = request.user
    submissions = FormSubmission.objects.filter(user=user).order_by('submission_date')
    
    submissions_data = [
        {
            "id": submission.pk,
            "submission_date": submission.submission_date.strftime('%d/%m/%Y'),
            "score": submission.score
        }
        for submission in submissions
    ]
    
    return Response(submissions_data)


@api_view(['GET'])
def get_user_info(request):
    user = request.user
    user_data = {
        "username": user.username,
        "email": user.email,
        "cep": user.cep
    }
    
    return Response(user_data)


@api_view(['POST'])
def save_cep(request):
    user = request.user
    cep = request.data.get('cep')

    user.cep = cep

    endereco = brazilcep.get_address_from_cep(cep)

    geolocator = Nominatim(user_agent="felizmente")
    location = geolocator.geocode(f"{endereco['district']}, {endereco['city']} - {endereco['uf']}")

    user.latitude = location.latitude
    user.longitude = location.longitude

    user.save(update_fields=['cep', 'latitude', 'longitude'])

    return Response({"success": True})


@api_view(['GET'])
def get_advice(request):
    last_advice = cache.get('last_advice')
    new = request.query_params.get('new', False)

    if last_advice and not new:
        return Response({"advice": last_advice})
    
    model = GPT4All(model_name="llama.gguf", model_path=settings.BASE_DIR, device="gpu")

    last_form = FormSubmission.objects.filter(user=request.user).last()
    answers = Answer.objects.filter(form_submission=last_form).select_related('question')

    with model.chat_session() as session:
        base_prompt = [
            "Fiz recentemente um teste de felicidade e gostaria de verificar se você tem algum conselho para mim."
            "Aqui estão as minhas últimas submissões:"
        ]

        for answer in answers:
            base_prompt.append(f"Questão: {answer.question.text} - Resposta: {answer.value}")
        
        base_prompt.append("ME RESPONDA EM PORTUGUÊS BRASILEIRO")
        base_prompt = "\n".join(base_prompt)

        advice = session.generate(base_prompt, max_tokens=1024)
        cache.set('last_advice', advice, 60 * 60 * 24)

    return Response({"advice": advice})


@api_view(['GET'])
def get_happiness(request):
    all_users = User.objects.all()

    # Inicializa uma lista para armazenar os dados de felicidade
    happiness_data = []

    # Para cada usuário, obter a última submissão manualmente
    for user in all_users:
        last_submission = FormSubmission.objects.filter(user=user).order_by('-submission_date').first()

        if last_submission:
            happiness_data.append({
                "cep": last_submission.user.cep,
                "latitude": last_submission.user.latitude,
                "longitude": last_submission.user.longitude,
                "score": round(last_submission.score, 2)
            })

    return Response(happiness_data)
