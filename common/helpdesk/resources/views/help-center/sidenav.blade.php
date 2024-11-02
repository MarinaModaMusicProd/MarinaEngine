<div class="hc-sidenav left">
    @foreach($category['sections'] as $section)
        <h3 class="highlight-item {{slugify($section['name'])}}">{{$section['name']}}</h3>
        <ul>
            @foreach($section['articles'] as $article)
                <li>
                    <a href="{{'../' . slugify($section['name']) . '/' . slugify($article['title']) . '.html'}}" class="highlight-item {{slugify($article['title'])}}">{{$article['title']}}</a>
                </li>
            @endforeach
        </ul>
    @endforeach
</div>
