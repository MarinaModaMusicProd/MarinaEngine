<meta property="og:site_name" content="{{ settings('branding.site_name') }}" />
<meta property="twitter:card" content="summary" />
<meta property="og:type" content="profile" />
<title>{{ $user->name }} - {{ settings('branding.site_name') }}</title>
<meta
    property="og:title"
    content="{{ $user->name }} - {{ settings('branding.site_name') }}"
/>
<meta property="og:url" content="{{ urls()->user($user) }}" />
<link rel="canonical" href="{{ urls()->user($user) }}" />

@if ($user->image)
    <meta property="og:image" content="{{ urls()->image($user->image) }}" />
    <meta property="og:width" content="200" />
    <meta property="og:height" content="200" />
@endif

<meta property="og:description" content="{{ $user->profile->description }} - {{ settings('branding.site_name') }}" />
<meta name="description" content="{{ $user->profile->description }} - {{ settings('branding.site_name') }}" />
