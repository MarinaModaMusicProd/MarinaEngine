<?php namespace Common\Settings;

use Common\Core\AppUrl;
use Common\Core\BaseController;
use Common\Settings\Events\SettingsSaved;
use Common\Settings\Mail\ConnectGmailAccountController;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class SettingsController extends BaseController
{
    public function __construct(
        protected Request $request,
        protected Settings $settings,
    ) {
    }

    public function index()
    {
        $this->authorize('index', Setting::class);

        return $this->getAllSettings();
    }

    protected function getAllSettings(): array
    {
        $envSettings = (new DotEnvEditor())->load();
        $envSettings['newAppUrl'] = app(AppUrl::class)->newAppUrl;
        $envSettings[
            'connectedGmailAccount'
        ] = ConnectGmailAccountController::getConnectedEmail();

        // inputs on frontend can't be bound to null
        foreach ($envSettings as $key => $value) {
            if ($value === null) {
                $envSettings[$key] = '';
            }
        }

        return [
            'server' => $envSettings,
            'client' => $this->settings->getAllForFrontendForm(),
        ];
    }

    public function persist()
    {
        $this->authorize('update', Setting::class);

        $serverSettings = $this->cleanValues(request('server'), 'server');
        $clientSettings = $this->cleanValues(request('client'), 'client');

        // need to handle files before validating
        $this->handleFiles();

        if (
            $errResponse = $this->validateSettings(
                $serverSettings,
                $clientSettings,
            )
        ) {
            return $errResponse;
        }

        if ($serverSettings) {
            (new DotEnvEditor())->write($serverSettings);
        }

        if ($clientSettings) {
            settings()->save($clientSettings);
        }

        Cache::flush();

        event(new SettingsSaved($clientSettings, $serverSettings));

        return $this->getAllSettings();
    }

    private function cleanValues(string|null $values, string $type): array
    {
        if (!$values) {
            return [];
        }

        $values = json_decode($values);
        $values = settings()->castToArrayPreserveEmptyObjects($values);

        // values from frontend will come in nested object format
        if ($type === 'client') {
            $values = settings()->flatten($values);
        }

        // get current values in flat format as well, so we can easily
        // find value by dot notation key and compare json values
        $current =
            $type === 'client'
                ? settings()->flatten(settings()->all())
                : (new DotEnvEditor())->load();

        $changed = [];
        foreach ($values as $key => $value) {
            $value = is_string($value) ? trim($value) : $value;
            if (!isset($current[$key]) || $current[$key] !== $value) {
                $changed[$key] = $value;
            }
        }

        return $changed;
    }

    private function handleFiles()
    {
        $files = $this->request->allFiles();

        // store google analytics certificate file
        if ($certificateFile = Arr::get($files, 'certificate')) {
            File::put(
                storage_path('laravel-analytics/certificate.json'),
                file_get_contents($certificateFile),
            );
        }
    }

    private function validateSettings(
        array $serverSettings,
        array $clientSettings,
    ) {
        // flatten "client" and "server" arrays into single array
        $values = array_merge(
            $serverSettings ?: [],
            $clientSettings ?: [],
            $this->request->allFiles(),
        );

        // remove falsy values, because frontend forms will return all
        // possible fields and empty fields will have empty string as value
        $values = array_filter($values);
        $keys = array_keys($values);

        $validators = config('common.setting-validators');

        foreach ($validators as $validator) {
            $validatorKeys = array_map(
                fn($key) => strtolower($key),
                $validator::KEYS,
            );
            $changedKeys = array_map(fn($key) => strtolower($key), $keys);
            if (empty(array_intersect($validatorKeys, $changedKeys))) {
                continue;
            }

            if ($messages = app($validator)->fails($values)) {
                return $this->error(
                    __('Could not persist settings.'),
                    $messages,
                );
            }
            // catch and display any generic error that might occur
        }
    }
}
