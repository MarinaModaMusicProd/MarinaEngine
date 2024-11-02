<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('css_themes', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('css_themes');

            $table
                ->string('type', 40)
                ->index()
                ->default('site')
                ->after('user_id');
            $table
                ->integer('user_id')
                ->nullable()
                ->change();

            if (array_key_exists('css_themes_name_unique', $indexesFound)) {
                $table->dropIndex('css_themes_name_unique');
            }
        });
    }
};
