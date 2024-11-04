<?php

namespace Common\HelpDesk\HelpCenter\Actions;

use App\Models\SearchTerm;
use Common\Database\Metrics\MetricDateRange;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Facades\DB;

class SearchReport
{
    public function __construct(
        protected MetricDateRange|null $dateRange = null,
    ) {
    }

    public function generate(array $params): AbstractPaginator
    {
        $orderBy = $params['orderBy'] ?? 'count';
        $pagination = SearchTerm::when(
            isset($params['userId']),
            fn($query) => $query->where('user_id', $params['userId']),
        )
            ->when(
                isset($params['failedSearches']),
                fn($query) => $query->where('result_count', 0),
            )
            ->when($this->dateRange, function ($query) {
                $query->whereBetween('search_terms.created_at', [
                    $this->dateRange->start,
                    $this->dateRange->end,
                ]);
            })
            ->select([
                DB::raw('max(id) as id'),
                DB::raw('max(term) as term'),
                DB::raw('max(created_at) as last_seen'),
                DB::raw('count(*) as count'),
                DB::raw('max(category_id) as category_id'),
                DB::raw('sum(created_ticket) as resulted_in_ticket'),
                DB::raw('sum(clicked_article) as clicked_article'),
            ])
            ->groupBy('normalized_term')
            ->orderBy($orderBy, 'desc')
            ->simplePaginate();

        $pagination->through(function (SearchTerm $term) {
            $term->ctr = number_format(
                ($term->clicked_article / $term->count) * 100,
                2,
            );
            return $term;
        });

        $pagination->load([
            'category' => function (BelongsTo $query) {
                $query->select('id', 'name', 'image');
            },
        ]);

        return $pagination;
    }
}
