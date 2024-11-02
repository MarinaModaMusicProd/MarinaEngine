<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chat_visits', function (Blueprint $table) {
            $table->id();
            $table->integer('visitor_id')->index();
            $table->text('url');
            $table->text('title');
            $table->text('referrer')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('ended_at')->nullable();
        });

        DB::statement(
            'CREATE INDEX chat_visits_url_index ON chat_visits (url(100));',
        );
        DB::statement(
            'CREATE INDEX chat_visits_title_index ON chat_visits (title(100));',
        );
        DB::statement(
            'CREATE INDEX chat_visits_referrer_index ON chat_visits (referrer(100));',
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_visits');
    }
};
