<?php

namespace Common\Domains;

use Closure;
use Common\Core\AppUrl;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShowCustomDomainConnectedMessage
{
    public function handle(Request $request, Closure $next): Response
    {
        // allow validating custom domain
        if (
            $request->path() ===
            CustomDomainController::VALIDATE_CUSTOM_DOMAIN_PATH
        ) {
            return $next($request);
        }

        if (
            config('common.site.enable_custom_domains') &&
            !app(AppUrl::class)->envAndCurrentHostsAreEqual
        ) {
            $message = app(AppUrl::class)->matchedCustomDomain
                ? __(
                    'Custom domain connected successfully. You can manage it from your dashboard.',
                )
                : __(
                    'Custom domain DNS records configured properly. You can now connect this domain from your dashboard.',
                );

            return response()->view(
                'common::domains/domain-connected-message',
                compact('message'),
            );
        }

        return $next($request);
    }
}
