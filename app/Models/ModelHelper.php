<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

trait ModelHelper {

    /**
     * Get the first record matching the attributes or create it.
     *
     * @param array $data
     *
     * @return Model|static
     */
    public function findOrCreate(array $data)
    {
        if (! is_null($instance = self::where($data)->first())) {
            return $instance;
        }

        return tap(self::newModelInstance($data), static function ($instance) {
            $instance->save();
        });
    }
}
