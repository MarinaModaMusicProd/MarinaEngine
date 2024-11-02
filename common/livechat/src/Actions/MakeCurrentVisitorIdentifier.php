<?php

namespace Livechat\Actions;

class MakeCurrentVisitorIdentifier
{
    public function execute(string $ip = null): string
    {
        $ip = $ip ?: getIp();
        $userAgent = request()->userAgent();
        return md5("$ip|$userAgent");
    }
}
