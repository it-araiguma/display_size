<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IndexController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Index');
    }

    public function privacy(): Response
    {
        return Inertia::render('Privacy');
    }
}
