<?php

namespace Common\Auth\Traits;

trait HasDisplayNameAttribute
{
    public function getNameAttribute(): string
    {
        if ($this->username) {
            return $this->username;
        } elseif ($this->first_name && $this->last_name) {
            return $this->first_name . ' ' . $this->last_name;
        } elseif ($this->first_name) {
            return $this->first_name;
        } elseif ($this->last_name) {
            return $this->last_name;
        } else {
            return explode('@', $this->email)[0];
        }
    }
}
