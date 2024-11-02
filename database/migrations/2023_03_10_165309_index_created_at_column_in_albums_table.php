<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('albums', function (Blueprint $table) {
            $sm = Schema::getConnection()->getDoctrineSchemaManager();
            $indexesFound = $sm->listTableIndexes('albums');
            if (!array_key_exists('albums_created_at_index', $indexesFound)) {
                $table->index('created_at');
            }
        });
    }

    public function down()
    {
        //
    }
};
