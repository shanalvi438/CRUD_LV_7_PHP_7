<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTableAddIsVerifiedColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table( 'users', static function ( Blueprint $table ) {
            $table->boolean( 'is_verified' )->default(0)->nullable();
            $table->boolean( 'is_approved' )->default(0)->nullable();
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table( 'users', static function ( Blueprint $table ) {
            $table->dropColumn( [ 'is_verified', 'is_approved' ] );
        } );
    }
}
