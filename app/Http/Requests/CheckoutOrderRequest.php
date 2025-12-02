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
            'phone' => ['required', 'string', 'regex:/^[\d\s\-\+\(\)]+$/', 'min:10', 'max:32'],
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
            'fullName.string' => 'Full name must be a valid text.',
            'fullName.max' => 'Full name cannot exceed 255 characters.',
            'phone.required' => 'Phone number is required.',
            'phone.regex' => 'Phone number contains invalid characters. Use only digits, spaces, hyphens, and parentheses.',
            'phone.min' => 'Phone number must be at least 10 digits.',
            'phone.max' => 'Phone number cannot exceed 32 characters.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'area.required' => 'Please select a delivery area.',
            'area.in' => 'Please select a valid delivery area.',
            'fullAddress.required' => 'Delivery address is required.',
            'fullAddress.string' => 'Delivery address must be a valid text.',
            'fullAddress.max' => 'Delivery address cannot exceed 500 characters.',
            'orderNotes.string' => 'Order notes must be a valid text.',
            'orderNotes.max' => 'Order notes cannot exceed 1000 characters.',
        ];
    }
}


