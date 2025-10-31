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
        $contacts = Contact::orderByDesc('created_at')->get()->map(function ($contact) {
            return [
                'id' => $contact->id,
                'name' => $contact->name ?? '',
                'email' => $contact->email ?? '',
                'subject' => $contact->subject ?? '',
                'message' => $contact->message ?? '',
                'status' => $contact->status ?? 'new',
                'date' => optional($contact->created_at)->toIso8601String(),
            ];
        });

        return Inertia::render('Admin/Contents/ContactList', [
            'contacts' => $contacts,
        ]);
    }

    public function markAsReplied(Request $request)
    {
        $contact = Contact::find($request->id);
        if (!$contact) {
            return redirect()->back()->with('error', 'Contact not found');
        }
        $contact->status = 'replied';
        $contact->save();
        return redirect()->back()->with('success', 'Contact marked as replied successfully');
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
