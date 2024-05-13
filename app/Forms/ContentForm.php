<?php

namespace App\Forms;

use App\Forms\BaseForm;
use Illuminate\Validation\Rule;

/**
 * @property string $name
 * @property string $slug
 * @property string $type
 * @property string $content
 */
class ContentForm extends BaseForm {

    /** @var $name */
    public $name;

    /** @var $slug */
    public $slug;

    /** @var $type */
    public $type;

    /** @var $content */
    public $content;

    /**
     * Convert Instance to Array
     * @return array
     */
    public function toArray() {
        return [
            'name'    => $this->name,
            'slug'    => $this->slug,
            'type'    => $this->type,
            'content' => $this->content,
        ];
    }

    /**
     * Rules For CreateUserForm
     * @return array
     */
    public function rules() {
        return [
            'name'    => 'required',
            'slug'    => 'required',
            'type'    => 'required',
            'content' => 'required',
        ];

    }
}
