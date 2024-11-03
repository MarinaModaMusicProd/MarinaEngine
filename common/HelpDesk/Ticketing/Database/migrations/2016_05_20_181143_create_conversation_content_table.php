<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

return new class extends Migration {
    public function up()
    {
        if (
            Schema::hasTable('conversation_content') ||
            Schema::hasTable('replies')
        ) {
            return;
        }

        Schema::create('conversation_content', function (Blueprint $table) {
            $table->increments('id');
            $table->text('body');
            $table
                ->integer('user_id')
                ->nullable()
                ->index();
            $table
                ->string('author', 40)
                ->nullable()
                ->index();
            $table->integer('conversation_id')->index();
            $table->string('type')->index();
            $table->uuid()->index();
            $table->timestamps();

            $table->collation = config('database.connections.mysql.collation');
            $table->charset = config('database.connections.mysql.charset');
        });
    }

    public function down()
    {
        Schema::drop('conversation_content');
    }
};
