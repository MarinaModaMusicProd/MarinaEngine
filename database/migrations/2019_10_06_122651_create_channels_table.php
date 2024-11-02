<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('channels', function (Blueprint $table) {
            $table->id();
            $table
                ->string('slug', 50)
                ->unique()
                ->nullable();
            $table->string('name');
            $table
                ->boolean('internal')
                ->default(false)
                ->index();
            $table->text('description')->nullable();
            $table
                ->string('type', 10)
                ->default('channel')
                ->index();
            $table
                ->boolean('public')
                ->default(true)
                ->index();
            $table
                ->bigInteger('user_id')
                ->unsigned()
                ->nullable()
                ->index();
            $table->longText('config');
            $table->timestamps();
        });
    }
    public function down()
    {
        Schema::dropIfExists('channels');
    }
};
