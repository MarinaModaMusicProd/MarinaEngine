<?php

namespace Livechat\Seeders;

use Common\Admin\Appearance\Themes\CssTheme;

class ChatWidgetThemesSeeder
{
    public function execute(): void
    {
        $dark = config('common.themes.dark');
        $light = config('common.themes.light');

        $lightTheme = CssTheme::where('type', 'chatWidget')
            ->where('default_light', true)
            ->exists();
        if (!$lightTheme) {
            CssTheme::create([
                'name' => 'Light',
                'default_light' => true,
                'values' => $light,
                'type' => 'chatWidget',
                'user_id' => 1,
            ]);
        }

        $darkTheme = CssTheme::where('type', 'chatWidget')
            ->where('default_dark', true)
            ->exists();
        if (!$darkTheme) {
            CssTheme::create([
                'name' => 'Dark',
                'is_dark' => true,
                'default_dark' => true,
                'values' => $dark,
                'type' => 'chatWidget',
                'user_id' => 1,
            ]);
        }
    }
}
