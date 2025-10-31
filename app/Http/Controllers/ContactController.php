<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Web/Contact');
    }

    public function list()
    {
        return Inertia::render('Admin/Contents/ContactList');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string|max:255',
        ]);

        Contact::create([
            'name' => $request->name,
            'email' => $request->email,
            'subject' => $request->message,
            'message' => $request->message,
        ]);

        return redirect()->back()->with('success', 'Contact created successfully');
    }
}
