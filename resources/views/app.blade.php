<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    @if(app()->environment('production'))
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZDL50G0KC1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];

        function gtag() {
            dataLayer.push(arguments);
        }

        gtag('js', new Date());

        gtag('config', 'G-ZDL50G0KC1');
    </script>
    @endif

    <!-- Dynamic Title and Meta Tags for SEO -->
    <title id="page-title">画面サイズチェッカー | ディスプレイ画面の幅、縦、インチが計測できる便利ツール</title>
    <meta id="page-description" name="description" content="画面サイズチェッカーはディスプレイ画面の幅、縦、インチが計測できる便利ツールです。">

    <link rel="icon" href="{{ asset('images/favicon.ico') }}">
    <link rel="manifest" href="{{ asset('manifest.json') }}">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Open Graph Meta Tags -->
    <meta id="og-title" property="og:title" content="画面サイズチェッカー | ディスプレイ画面の幅、縦、インチが計測できる便利ツール" />
    <meta id="og-description" property="og:description" content="画面サイズチェッカーはディスプレイ画面の幅、縦、インチが計測できる便利ツールです。" />
    <meta property="og:url" content="{{ config('app.url') }}" />
    <meta property="og:image" content="{{ asset('images/logo.png') }}" />
    <meta property="og:type" content="website" />
    <meta id="og-site-name" property="og:site_name" content="画面サイズチェッカー" />

    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@it_araiguma">

    <!-- Alternate Language Links for SEO -->
    <link rel="alternate" hreflang="ja" href="{{ config('app.url') }}?lang=ja" />
    <link rel="alternate" hreflang="en" href="{{ config('app.url') }}?lang=en" />
    <link rel="alternate" hreflang="zh-CN" href="{{ config('app.url') }}?lang=zh-CN" />
    <link rel="alternate" hreflang="ko" href="{{ config('app.url') }}?lang=ko" />
    <link rel="alternate" hreflang="x-default" href="{{ config('app.url') }}" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
    @inertiaHead
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9551028273212184"
        crossorigin="anonymous"></script>
    <!-- AdSenseの自動初期化スクリプトを削除 -->
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>