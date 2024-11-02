<?php namespace Helpdesk\Triggers\Conditions;

use Illuminate\Support\Str;

class PrimitiveValuesComparator {

    /**
     * Compare string haystack and needle using specified operator.
     */
    public function compare(mixed $haystack, mixed $needle, string $operator): bool
    {
        return match ($operator) {
            'contains' => Str::contains($haystack, $needle, true),
            'not_contains' => ! Str::contains($haystack, $needle, true),
            'starts_with' => Str::startsWith($haystack, $needle),
            'ends_with' => Str::endsWith($haystack, $needle),
            'equals', 'is' => $haystack === $needle,
            'not_equals', 'not' => $haystack !== $needle,
            'more' => $haystack > $needle,
            'less' => $haystack < $needle,
            'matches_regex' => (bool) preg_match("/$needle/", $haystack),
            default => false,
        };
    }
}
