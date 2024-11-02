@extends('common::prerender.base')

@section('head')
    @include('seo.category-page.seo-tags')
@endsection

@section('body')
    <h1 class="title">{{ $category->name }}</h1>

    {!! $category->description !!}

    <div class="children">
        @foreach ($category->sections as $section)
            <div class="child">
                <h2>
                    <a href="{{ urls()->category($section) }}">
                        {{ $section['name'] }}
                    </a>
                </h2>
            </div>
        @endforeach
    </div>

    @if ($articles = $category->articles)
        <div class="articles">
            @foreach ($articles as $article)
                <div class="article">
                    <h2>
                        <a href="{{ urls()->article($article) }}">
                            {{ $article['title'] }}
                        </a>
                    </h2>
                </div>
            @endforeach
        </div>
    @endif
@endsection
