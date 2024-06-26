<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterUsersTableAddOptColumn extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table( 'users', static function ( Blueprint $table ) {
            $table->string( 'signup_otp' )->nullable();
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table( 'users', static function ( Blueprint $table ) {
            $table->dropColumn( [ 'signup_otp' ] );
        } );
    }
}
