<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasColumn('conversations', 'type')) {
            return;
        }
        Schema::table('conversations', function (Blueprint $table) {
            $table
                ->string('type', 50)
                ->default('ticket')
                ->after('group_id')
                ->index();
        });
    }
};
