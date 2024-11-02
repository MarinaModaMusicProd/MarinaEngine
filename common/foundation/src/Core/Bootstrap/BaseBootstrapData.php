<?php namespace Common\Core\Bootstrap;

use App\Models\User;
use Common\Admin\Appearance\Themes\CssTheme;
use Common\Auth\Jobs\LogActiveSessionJob;
use Common\Auth\Roles\Role;
use Common\Billing\Gateways\Stripe\FormatsMoney;
use Common\Core\AppUrl;
use Common\Localizations\LocalizationsRepository;
use Common\Settings\Settings;
use Common\Websockets\GetWebsocketCredentialsForClient;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\View;
use Jenssegers\Agent\Agent;
use Laravel\Sanctum\PersonalAccessToken;

class BaseBootstrapData implements BootstrapData
{
    use FormatsMoney;

    protected array $data = [];
    public ?CssTheme $initialTheme = null;

    public function __construct(
        protected Settings $settings,
        protected Request $request,
        protected Role $role,
        protected LocalizationsRepository $localizationsRepository,
    ) {
    }

    public function getEncoded(): string
    {
        if ($this->data['user']) {
            $this->data['user'] = $this->data['user']->toArray();
        }

        return json_encode($this->data);
    }

    public function set(string $key, mixed $value): static
    {
        Arr::set($this->data, $key, $value);
        return $this;
    }

    public function get($key = null)
    {
        return $key ? Arr::get($this->data, $key) : $this->data;
    }

    public function init(): self
    {
        $this->data['settings'] = settings()->getUnflattened();
        $this->data['settings'][
            'broadcasting'
        ] = (new GetWebsocketCredentialsForClient())->execute();
        $this->data['csrf_token'] = csrf_token();
        $this->data['is_mobile_device'] = app(Agent::class)->isMobile();
        $this->data['settings']['base_url'] = config('app.url');
        $this->data['settings']['asset_url'] = config('app.asset_url');
        $this->data['settings']['html_base_uri'] = app(
            AppUrl::class,
        )->htmlBaseUri;
        $this->data['settings']['version'] = config('common.site.version');
        $this->data['sentry_release'] = config('sentry.release');
        $this->data['default_meta_tags'] = $this->getDefaultMetaTags();
        $this->data['user'] = $this->getCurrentUser();
        $this->data['guest_role'] = app('guestRole')?->load('permissions');
        $this->data['i18n'] =
            $this->localizationsRepository->getByNameOrCode(
                app()->getLocale(),
                settings('i18n.enable', true),
            ) ?:
            null;
        $this->data['themes'] = $this->getThemes();
        $this->setInitialTheme();
        $this->data['language'] = $this->data['i18n']
            ? $this->data['i18n']['language']
            : 'en';

        if (
            config('common.site.notifications_integrated') &&
            $this->data['user']
        ) {
            $this->data['user']->loadCount('unreadNotifications');
        }

        $alreadyAccepted =
            !settings('cookie_notice.enable') ||
            (bool) Arr::get($_COOKIE, 'cookie_notice', false);
        $this->data['show_cookie_notice'] =
            !$alreadyAccepted && $this->isCookieLawCountry();

        $this->logActiveSession();

        return $this;
    }

    protected function setInitialTheme(): void
    {
        $themes = $this->data['themes'];

        // first, get theme from cookie
        if (
            $cookieTheme = $themes->find(Arr::get($_COOKIE, 'be-active-theme'))
        ) {
            $this->initialTheme = $themes->find($cookieTheme);
        }

        // if no theme was selected, get default theme specified by admin
        elseif ($defaultId = settings('themes.default_id')) {
            // when default theme is set to system, use light theme
            // initially as there's no way to get user's preference
            // without javascript. Correct theme variables will be set once front end loads.
            if ($defaultId === 'system' || $defaultId == 0) {
                $this->initialTheme = $themes
                    ->where('default_light', true)
                    ->first();
            } else {
                $this->initialTheme = $themes->find($defaultId);
            }
        }

        // finally, fallback to default light theme
        if (!$this->initialTheme) {
            $this->initialTheme =
                $themes->where('default_light', true)->first() ??
                $themes->first();
        }
    }

    public function getThemes(): Collection
    {
        $themes = CssTheme::where('type', 'site')
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

    /**
     * Load current user and his roles.
     */
    public function getCurrentUser(): ?User
    {
        $user = $this->request->user();
        if ($user) {
            // load user subscriptions, if billing is enabled
            if (
                settings('billing.enable') &&
                !$user->relationLoaded('subscriptions')
            ) {
                $user->load('subscriptions.price');
            }

            // load user roles, if not already loaded
            if (!$user->relationLoaded('roles')) {
                $user->load('roles');
            }

            if (!$user->relationLoaded('permissions')) {
                $user->loadPermissions();
            }
        }

        return $user;
    }

    protected function getDefaultMetaTags(): string
    {
        $pageName = 'landing-page';
        if (View::exists("editable-views::seo-tags.$pageName")) {
            return view("editable-views::seo-tags.$pageName")->render();
        } else {
            return view("seo.$pageName.seo-tags")->render();
        }
    }

    protected function isCookieLawCountry(): bool
    {
        $isoCode = geoip(getIp())['iso_code'];
        // prettier-ignore
        return in_array($isoCode, ['AT', 'BE', 'BG', 'BR', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'GB', 'HR', 'HU', 'IE', 'IT','LT', 'LU', 'LV', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
        ]);
    }

    protected function logActiveSession(): void
    {
        if ($this->data['user']) {
            $token = $this->data['user']->currentAccessToken();
            LogActiveSessionJob::dispatch([
                'user_id' => $this->data['user']->id,
                'ip_address' => getIp(),
                'user_agent' => $this->request->userAgent(),
                'session_id' => session()->getId(),
                'token' =>
                    $token instanceof PersonalAccessToken
                        ? $token->token
                        : null,
            ]);
        }
    }
}
