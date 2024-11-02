<?php

namespace Common\Core\Install;

use Carbon\Carbon;
use Common\Settings\Setting;

class InsertDefaultSettings
{
    public function execute(): void
    {
        if (Setting::count() > 0) {
            return;
        }

        $defaultSettings = config('common.default-settings');

        $names = [];

        $defaultSettings = array_map(function ($setting) use (&$names) {
            $names[] = $setting['name'];

            $setting['created_at'] = Carbon::now();
            $setting['updated_at'] = Carbon::now();

            //make sure all settings have "private" field to
            //avoid db errors due to different column count
            if (!array_key_exists('private', $setting)) {
                $setting['private'] = 0;
            }

            // cast booleans to string as "insert"
            // method will not use Setting model setters
            if ($setting['value'] === true) {
                $setting['value'] = 'true';
            } elseif ($setting['value'] === false) {
                $setting['value'] = 'false';
            }
            $setting['value'] = (string) $setting['value'];

            // will be inserted via CreateDefaultMenus
            if ($setting['name'] === 'menus') {
                return false;
            }

            return $setting;
        }, $defaultSettings);

        Setting::insert(array_filter($defaultSettings));
    }
}
