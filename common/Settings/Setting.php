<?php namespace Common\Settings;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use TransformsSettingsTableRowValue;

    protected $table = 'settings';

    protected $fillable = ['name', 'value'];

    protected $casts = ['private' => 'bool'];

    protected function value(): Attribute
    {
        return Attribute::make(
            get: function ($value) {
                return $this->decodeDbValue($this->attributes['name'], $value);
            },
            set: function ($value) {
                return $this->encodeValueForDb(
                    $this->attributes['name'],
                    $value,
                );
            },
        );
    }
}
