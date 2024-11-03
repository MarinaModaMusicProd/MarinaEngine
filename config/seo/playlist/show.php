<?php

return [
    [
        'property' => 'og:url',
        'content' =>  '{{url.playlist}}',
    ],
    [
        'property' => 'og:title',
        'content' => '{{playlist.name}} by {{playlist.editors.0.display_name}}',
    ],
    [
        'property' => 'og:description',
        'content' => '{{playlist.description}}',
    ],
    [
        'property' => 'og:type',
        'content' => 'music.playlist',
    ],
    [
        'property' => 'og:image',
        'content' => '{{playlist.image}}',
    ],
    [
        'property' => 'og:image:width',
        'content' => '300',
    ],
    [
        'property' => 'og:image:height',
        'content' => '300',
    ],
    [
        'nodeName' => 'script',
        'type' => 'application/ld+json',
        '_text' => [
            '@context' => 'http://schema.org',
            "@type" => "MusicPlaylist",
            '@id' => '{{url.playlist}}',
            'url' => '{{url.playlist}}',
            'name' => '{{playlist.name}}',
            "numTracks" => "{{playlist.tracks_count}}",
            'image' => '{{playlist.image}}',
            'description' => '{{playlist.description}}',
            "track" => [
                '_type' => 'loop',
                'dataSelector' => 'tracks',
                'limit' => 10,
                'template' => [
                    "@type" => "MusicRecording",
                    "@id" => "{{url.track}}",
                    "url" => "{{url.track}}",
                    "name" => "{{track.name}}",
                    "datePublished" => "{{track.album.release_date}}"
                ]
            ],
        ]
    ]
];
