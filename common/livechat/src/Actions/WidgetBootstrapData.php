<?php

namespace Livechat\Actions;

use Common\Admin\Appearance\Themes\CssTheme;
use Common\Localizations\LocalizationsRepository;
use Common\Websockets\GetWebsocketCredentialsForClient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Livechat\Models\ChatVisitor;

class WidgetBootstrapData
{
    public array $data = [];
    public ?CssTheme $initialTheme = null;

    public function __construct()
    {
        $this->initData();
    }

    protected function initData(): void
    {
        $mostRecentChat = ChatVisitor::mostRecentChatForCurrentRequest();

        $settings = settings()->getUnflattened();
        $settings['base_url'] = config('app.url');
        $settings[
            'broadcasting'
        ] = (new GetWebsocketCredentialsForClient())->execute();

        $this->data = [
            'themes' => $this->getThemes(),
            'i18n' =>
                app(LocalizationsRepository::class)->getByNameOrCode(
                    app()->getLocale(),
                    settings('i18n.enable', true),
                ) ?:
                null,
            'mostRecentChat' => $mostRecentChat,
            'settings' => $settings,
            'agents' => (new AgentsLoader())->getAllAgents(),
        ];

        $this->setInitialTheme();

        if (isset($mostRecentChat['visitor'])) {
            $mostRecentChat['visitor']->updateLastActiveDate();
        }
    }

    protected function getThemes(): Collection
    {
        $themes = CssTheme::where(
            'type',
            settings('chatWidget.inheritThemes') ? 'site' : 'chatWidget',
        )
            ->where(function (Builder $builder) {
                $builder
                    ->where('default_dark', true)
                    ->orWhere('default_light', true);
            })
            ->get();

        if ($themes->isEmpty()) {
            $themes = CssTheme::limit(2)->get();
        }

        return $themes;
    }

    protected function setInitialTheme(): void
    {
        $themes = $this->data['themes'];

        // if no theme was selected, get default theme specified by admin
        if ($defaultTheme = settings('chatWidget.defaultTheme')) {
            // when default theme is set to system, use light theme
            // initially as there's no way to get user's preference
            // without javascript. Correct theme variables will be set once front end loads.
            if ($defaultTheme === 'system' || $defaultTheme === 'light') {
                $this->initialTheme = $themes
                    ->where('default_light', true)
                    ->first();
            } else {
                $this->initialTheme = $themes
                    ->where('default_dark', true)
                    ->first();
            }
        }

        // finally, fallback to default light theme
        if (!$this->initialTheme) {
            $this->initialTheme =
                $themes->where('default_light', true)->first() ??
                $themes->first();
        }
    }
}
