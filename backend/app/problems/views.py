from ninja import Router, Schema
from ninja.pagination import paginate, LimitOffsetPagination
from typing import Optional, List
from django.db.models import Q, Prefetch, OuterRef, Exists, Count, BooleanField, Value
from django.contrib.auth import get_user_model

from submissions.models import Submission
from baseuser.models import BaseUser
from baseuser.authenticate import JWTAuth

from .models import (
    Category, Tags, Language, Problem,
    Hint, Challenge, Examples, Function, ExecutionTestCase
)

User = get_user_model()

# ==================== SCHEMAS ====================

class CategoryOut(Schema):
    name: str
    slug: str

class TagOut(Schema):
    id: int
    name: str

class LanguageOut(Schema):
    name: str
    slug: Optional[str] = None

class ExampleOut(Schema):
    id: int
    input_txt: str
    output_txt: str
    explanation: Optional[str] = None

class HintOut(Schema):
    id: int
    text: str

class ChallengeOut(Schema):
    id: int
    text: str

class ProblemListOut(Schema):
    title: str
    slug: str
    difficulty: str
    points: int
    problem_type: str
    category: Optional[CategoryOut] = None
    tags: List[TagOut] = []
    solved_count: Optional[int] = None
    is_solved: Optional[bool] = None

class ProblemDetailOut(Schema):
    title: str
    slug: str
    description: str
    difficulty: str
    points: int
    problem_type: str
    constraints: str = ""
    category: Optional[CategoryOut] = None
    tags: List[TagOut] = []
    languages: List[LanguageOut] = []
    examples: List[ExampleOut] = []
    hints: List[HintOut] = []
    challenges: List[ChallengeOut] = []
    time_limit: int = 2000
    memory_limit: int = 256
    is_solved: Optional[bool] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class FunctionTemplateOut(Schema):
    function: str

class StatsOut(Schema):
    total_problems: int
    total_categories: int
    total_tags: int
    total_languages: int
    difficulty_distribution: dict[str, int]
    problem_type_distribution: dict[str, int]

# ==================== ROUTER ====================

api = Router(tags=["problems"])

# ==================== ENDPOINTS ====================

@api.get("/categories", response=List[CategoryOut], auth=JWTAuth())
def get_categories(request):
    categories = Category.objects.all().order_by("name")
    return [CategoryOut(name=c.name, slug=c.slug) for c in categories]

@api.get("/tags", response=List[TagOut], auth=JWTAuth())
def get_tags(request):
    tags = Tags.objects.all().order_by("name")
    return [TagOut(id=t.id, name=t.name) for t in tags]

@api.get(
    "/languages",
    response={
        200: List[LanguageOut],
    },
    auth=JWTAuth()
)
def get_languages(request):
    languages = Language.objects.all().order_by("name")
    return [
        LanguageOut(name=l.name, slug=l.slug)
        for l in languages
    ]


from django.db.models import Count, Q, Exists, OuterRef

# ==================== Problem List ====================
@api.get("/problems", response=List[ProblemListOut], auth=JWTAuth())
@paginate(LimitOffsetPagination, page_size=20)
def get_problems(
    request,
    difficulty: Optional[int] = None,
    category_id: Optional[int] = None,
    tag_id: Optional[int] = None,
    search: Optional[str] = None,
    problem_type: Optional[str] = None,
    contest_id: Optional[int] = None,
):
    telegram_id = request.auth.telegram_id  # JWT orqali user

    # Subquery: aynan shu user accepted qilganmi
    user_solved_subquery = Submission.objects.filter(
        user__telegram_id=telegram_id,
        problem=OuterRef('pk'),
        status='accepted'
    )


    # Queryset
    queryset = Problem.objects.filter(is_active=True).select_related('category').prefetch_related('tags').annotate(
        solved_count=Count(
            'submissions',
            filter=Q(submissions__status='accepted'),
            distinct=True
        ),
        is_solved=Exists(user_solved_subquery)
    )

    # Filtrlash
    if difficulty:
        queryset = queryset.filter(difficulty=difficulty)
    if category_id:
        queryset = queryset.filter(category_id=category_id)
    if tag_id:
        queryset = queryset.filter(tags__id=tag_id)
    if problem_type:
        queryset = queryset.filter(problem_type=problem_type)
    if contest_id:
        queryset = queryset.filter(contest_id=contest_id)
    if search:
        queryset = queryset.filter(Q(title__icontains=search) | Q(description__icontains=search))

    queryset = queryset.order_by('-created_at').distinct()

    return [
        ProblemListOut(
            title=p.title,
            slug=p.slug,
            difficulty=p.difficulty,
            points=p.points,
            problem_type=p.problem_type,
            category=CategoryOut(
                name=p.category.name,
                slug=p.category.slug
            ) if p.category else None,
            tags=[TagOut(id=t.id, name=t.name) for t in p.tags.all()],
            solved_count=p.solved_count,
            is_solved=p.is_solved
        )
        for p in queryset
    ]


# ==================== Problem Detail ====================
@api.get("/problems/{problem_slug}", response=ProblemDetailOut, auth=JWTAuth())
def get_problem_detail(request, problem_slug: str):
    telegram_id = request.auth.telegram_id  # JWT orqali user

    # Subquery: aynan shu user accepted qilganmi
    user_solved_subquery = Submission.objects.filter(
        user__telegram_id=telegram_id,
        problem=OuterRef('pk'),
        status='accepted'
    )

    # Problemni olamiz va annotate qilamiz
    problem = Problem.objects.filter(slug=problem_slug, is_active=True).select_related(
        'category', 'user', 'contest'
    ).prefetch_related(
        'tags', 'language', 'examples', 'hints', 'challenges'
    ).annotate(
        is_solved=Exists(user_solved_subquery)
    ).first()

    if not problem:
        return 404, {"detail": "Problem not found"}

    return ProblemDetailOut(
        title=problem.title,
        slug=problem.slug,
        description=problem.description,
        difficulty=problem.difficulty,
        points=problem.points,
        problem_type=problem.problem_type,
        constraints=problem.constraints or "",
        category=CategoryOut(name=problem.category.name, slug=problem.category.slug) if problem.category else None,
        tags=[TagOut(id=t.id, name=t.name) for t in problem.tags.all()],
        languages=[LanguageOut(name=l.name, slug=l.slug) for l in problem.language.all()],
        examples=[ExampleOut(id=e.id, input_txt=e.input_txt, output_txt=e.output_txt, explanation=e.explanation) for e in problem.examples.all()],
        hints=[HintOut(id=h.id, text=h.text) for h in problem.hints.all()],
        challenges=[ChallengeOut(id=c.id, text=c.text) for c in problem.challenges.all()],
        is_solved=problem.is_solved,
        time_limit=problem.time_limit,
        memory_limit=problem.memory_limit,
        created_at=problem.created_at.isoformat() if problem.created_at else None,
        updated_at=problem.updated_at.isoformat() if problem.updated_at else None,
    )

@api.get("/problems/{problem_slug}/function/{language_slug}", response=FunctionTemplateOut, auth=JWTAuth())
def get_function_template(request, problem_slug: str, language_slug: str):
    function = Function.objects.filter(problem__slug=problem_slug, language__slug=language_slug)\
        .select_related('language', 'problem')\
        .first()
    if not function:
        return 404, {"detail": "Function template not found"}
    return FunctionTemplateOut(function=function.function)

@api.get("/problems/{problem_slug}/execution/{language_slug}", auth=JWTAuth())
def get_execution_template(request, problem_slug: str, language_slug: str):
    execution = ExecutionTestCase.objects.filter(problem__slug=problem_slug, language__slug=language_slug)\
        .select_related('language', 'problem')\
        .first()
    if not execution:
        return 404, {"detail": "Execution template not found"}
    return {
        "top_code": execution.top_code,
        "bottom_code": execution.bottom_code,
    }

@api.get("/stats", response=StatsOut)
def get_problem_stats(request):
    total_problems = Problem.objects.filter(is_active=True).count()
    total_categories = Category.objects.count()
    total_tags = Tags.objects.count()
    total_languages = Language.objects.count()

    easy = Problem.objects.filter(difficulty=1, is_active=True).count()
    medium = Problem.objects.filter(difficulty=2, is_active=True).count()
    hard = Problem.objects.filter(difficulty=3, is_active=True).count()

    darslik = Problem.objects.filter(problem_type="darslik", is_active=True).count()
    test = Problem.objects.filter(problem_type="test", is_active=True).count()
    problem = Problem.objects.filter(problem_type="probelm", is_active=True).count()

    return {
        "total_problems": total_problems,
        "total_categories": total_categories,
        "total_tags": total_tags,
        "total_languages": total_languages,
        "difficulty_distribution": {"easy": easy, "medium": medium, "hard": hard},
        "problem_type_distribution": {"darslik": darslik, "test": test, "problem": problem},
    }

@api.get("/contests/{contest_slug}/problems", response=List[ProblemListOut], auth=JWTAuth())
def get_contest_problems(request, contest_slug: str):
    problems = Problem.objects.filter(contest__slug=contest_slug, is_active=True)\
        .select_related('category')\
        .prefetch_related('tags')

    return [
        ProblemListOut(
            title=p.title,
            slug=p.slug,
            difficulty=p.difficulty,
            points=p.points,
            problem_type=p.problem_type,
            category=CategoryOut(name=p.category.name, slug=p.category.slug) if p.category else None,
            tags=[TagOut(id=t.id, name=t.name) for t in p.tags.all()]
        )
        for p in problems
    ]
