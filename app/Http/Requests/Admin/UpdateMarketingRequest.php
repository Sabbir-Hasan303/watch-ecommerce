<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMarketingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null && $this->user()->is_admin;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * The same request class is reused for different marketing update actions.
     * Each controller method validates only the fields it actually uses.
     */
    public function rules(): array
    {
        return [
            // Meta / Facebook Conversion API
            'dataset_id' => ['nullable', 'string', 'max:255'],
            'pixel_id' => ['nullable', 'string', 'max:255'],
            'access_token' => ['nullable', 'string'],
            'catalog' => ['nullable', 'string', 'max:255'],
            'test_event_code' => ['nullable', 'string', 'max:255'],
            'browser_tracking_enabled' => ['nullable', 'boolean'],
            'server_tracking_enabled' => ['nullable', 'boolean'],

            // Google
            'analytics_script' => ['nullable', 'string'],
            'tag_manager_head_script' => ['nullable', 'string'],
            'tag_manager_body_script' => ['nullable', 'string'],

            // TikTok
            'pixel_script' => ['nullable', 'string'],
        ];
    }
}


