@extends('common::prerender.base')

@section('head')
    @include($seoTagsView ?? 'seo.user-profile-page.seo-tags')
@endsection

@section('body')
    <h1>{{ $user->name }}</h1>

    <p>{{ $user->profile->description }}</p>

    @if ($user->image)
        <img src="{{urls()->image($user->image)}}" alt="">
    @endif

    <h2>{{__('Followers')}}</h2>
    <ul class="followers">
        @foreach($user->followers as $user)
            <li><a href="{{ urls()->user($user) }}">{{ $user['name'] }}</a></li>
        @endforeach
    </ul>

    <h2>{{__('Followed Users')}}</h2>
    <ul class="followed_users">
        @foreach($user->followedUsers as $user)
            <li><a href="{{ urls()->user($user) }}">{{ $user['name'] }}</a></li>
        @endforeach
    </ul>

    <h2>{{__('Playlists')}}</h2>
    <ul class="playlists">
        @foreach($user->playlists as $playlist)
            <li>
                <figure>
                    <img src="{{ $playlist['image'] }}">
                    <figcaption>
                        <a href="{{ urls()->playlist($playlist) }}">{{ $playlist['name'] }}</a>
                    </figcaption>
                </figure>
            </li>
        @endforeach
    </ul>
@endsection
