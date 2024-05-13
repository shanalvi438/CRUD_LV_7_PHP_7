<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AlterUsersTableAddDeviceTokenColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table( 'users', static function ( Blueprint $table ) {
            $table->text( 'device_token' )->nullable();
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table( 'users', static function ( Blueprint $table ) {
            $table->dropColumn( [ 'device_token' ] );
        } );
    }
}
