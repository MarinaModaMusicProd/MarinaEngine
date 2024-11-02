<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversation_summaries', function (Blueprint $table) {
            $table->id();
            $table
                ->integer('conversation_id')
                ->index()
                ->unsigned();
            $table->longText('content');
            $table
                ->integer('generated_by')
                ->unsigned()
                ->index();
            $table->timestamps();
        });
    }
};
