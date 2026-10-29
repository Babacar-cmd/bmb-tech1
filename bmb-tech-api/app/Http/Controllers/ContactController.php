<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Contact;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        // Validation des données reçues
        $validated = $request->validate([
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'sujet' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        // Enregistrement dans la base de données
        Contact::create($validated);

        // Réponse JSON pour React
        return response()->json([
            'message' => 'Message envoyé avec succès !'
        ], 201);
    }

    // Méthode pour l'espace admin (liste des messages)
    public function index()
    {
        return response()->json(Contact::latest()->get());
    }

    // Nouvelle méthode pour supprimer un message
    public function destroy($id)
    {
        $contact = Contact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'message' => 'Message supprimé avec succès !'
        ]);
    }
}