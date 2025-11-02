<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CheckoutOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullName' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'email' => ['required', 'email', 'max:255'],
            'area' => ['required', 'string', 'in:inside_dhaka,outside_dhaka'],
            'fullAddress' => ['required', 'string', 'max:500'],
            'orderNotes' => ['nullable', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'fullName.required' => 'Full name is required.',
            'phone.required' => 'Phone number is required.',
            'email.required' => 'Email address is required.',
            'area.required' => 'Please select a delivery area.',
            'fullAddress.required' => 'Delivery address is required.',
        ];
    }
}


