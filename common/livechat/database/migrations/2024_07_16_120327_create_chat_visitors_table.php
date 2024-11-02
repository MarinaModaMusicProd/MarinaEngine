<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chat_visitors', function (Blueprint $table) {
            $table->id();
            $table->string('user_identifier')->index();
            $table->string('user_ip')->nullable();
            $table
                ->integer('user_id')
                ->nullable()
                ->unsigned()
                ->index();
            $table
                ->string('email', 100)
                ->nullable()
                ->index();
            $table
                ->string('name')
                ->nullable()
                ->index();
            $table
                ->string('country', 10)
                ->nullable()
                ->index();
            $table
                ->string('city', 100)
                ->nullable()
                ->index();
            $table
                ->string('state', 50)
                ->nullable()
                ->index();
            $table
                ->string('timezone', 100)
                ->nullable()
                ->index();
            $table
                ->string('browser', 100)
                ->nullable()
                ->index();
            $table
                ->string('platform', 100)
                ->nullable()
                ->index();
            $table
                ->string('device', 100)
                ->nullable()
                ->index();
            $table
                ->boolean('is_crawler')
                ->default(false)
                ->index();
            $table->text('user_agent')->nullable();
            $table->longText('data')->nullable();
            $table
                ->integer('visits_count')
                ->default(0)
                ->unsigned()
                ->index();
            $table
                ->integer('time_on_all_pages')
                ->default(0)
                ->unsigned()
                ->index();
            $table
                ->timestamp('last_active_at')
                ->nullable()
                ->index();
            $table->timestamps();
            $table
                ->timestamp('banned_at')
                ->nullable()
                ->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_visitors');
    }
};
