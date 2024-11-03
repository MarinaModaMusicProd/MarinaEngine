<?php namespace Common\HelpDesk\HelpCenter\Requests;

use Common\Core\BaseFormRequest;

class ModifyHcArticle extends BaseFormRequest
{
    public function messages(): array
    {
        return [
            'sections.required' =>
                __('Article needs to be attached to at least one section.'),
        ];
    }

    public function rules(): array
    {
        $rules = [
            'title' => 'string|min:3|max:250|nullable',
            'slug' => 'string|min:3|max:250|nullable',
            'draft' => 'boolean',
            'author_id' => 'int|exists:users,id',
            'visible_to_role' => 'int|nullable',
            'managed_by_role' => 'int|nullable',
            'tags' => 'array',
            'tags.*' => 'string|min:1',
            'attachments' => 'array',
            'attachments.*' => 'int|min:1',
        ];

        if ($this->method() === 'POST') {
            $rules['sections'] = 'required|array|min:1';
            $rules['sections.*'] = 'required|integer|min:1';
            $rules['body'] = 'required';
            $rules['author_id'] = $rules['author_id'] . '|required';
        }

        return $rules;
    }
}
