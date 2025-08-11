[< Volver al índice](/docs/chapter/babySteps.md)

# Baby Steps - Episodios 01 a 04

## 1. Episodio 01 -  Hello, Laravel
En este episodio se presenta una introducción a Laravel, un framework de PHP para el desarrollo de aplicaciones web.

## 2. Episodio 02 - Your First Route and View

### Crear rutas en Laravel
+ De esta manera se crea una ruta que  responde con una vista de PHP:
```php
Route::get('/about', function () {
    return view('about');
});
```

+ De esta manera se retorna una respuesta en formato JSON desde una ruta de Laravel:
```php
Route::get('/json', function () {
    return ['foo' => 'bar', 'baz' => 'qux'];
});

Route::get('/contact', function () {
    return view('contact');
});
```
### Crear vistas en Laravel
+ Las vistas en Laravel se encuentran en el directorio `resources/views`.
+ Para este primer episodio creamos las vistas 'about.php' y 'contact.php' dentro del directorio `resources/views`.

## 3.Episodio 03 - Create a Layout File Using Laravel
En este episodio aprendimos a hacer el primer diseño simple de tres páginas, una introducción a los componentes en archivos de diseño.

### Crear Layouts en Laravel
Creamos un archivo de diseño llamado `layout.blade.php` en el directorio `resources/views/components`. 
Este archivo contendrá la estructura básica de nuestro sitio web, incluyendo el encabezado y el pie de página.
```php
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Page</title>
</head>

<body>
    <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
    </nav>

    <!-- <?php echo $slot ?> -->
     {{ $slot }}

</body>

</html>
```

### Usar Layouts en Laravel
Para usar el layout que acabamos de crear, modificamos las vistas `home.blade.php`, `about.blade.php` y `contact.blade.php` para que extiendan de este layout.

```php
<x-layout>
    <h1>Hello from the Home Page</h1>
</x-layout>
```

### Slots en Laravel
Los slots en Laravel son una forma de pasar contenido dinámico a los componentes de Blade. En el archivo `layout.blade.php`, usamos `{{ $slot }}` para indicar dónde se insertará el contenido de las vistas que extienden este layout. Sin embargo, también se puede utilizar la sintaxis antigua de PHP `<?php echo $slot ?>`, que es una forma menos común de hacerlo en Laravel. La forma recomendada es usar `{{ $slot }}`.

## 4. Episodio 04 - Make a Pretty Layout Using TailwindCSS
En este episodio, aprendimos a mejorar el diseño de nuestro sitio web utilizando TailwindCSS, un framework CSS que facilita la creación de diseños responsivos y atractivos.

### Aplicar TailwindCSS
Paa usar TailwindCSS en el proyeccto, se agrega el CDN de TailwindCSS en el archivo `layout.blade.php` dentro de la sección `<head>`:
```html
<script src="https://cdn.tailwindcss.com"></script>
```

### Mejorar el diseño con TailwindCSS
Para mejorar el diseño de nuestro sitio web, modificamos el archivo `layout.blade.php` para incluir clases de TailwindCSS que nos permitan crear un diseño más atractivo y responsivo. Aquí hay un ejemplo de cómo se vería el archivo `layout.blade.php` después de aplicar TailwindCSS y de editar el diseño a gusto:

```html
<div class="min-h-full">
  <nav class="bg-gray-800">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center">
          <div class="shrink-0">
            <img class="size-8" src="https://laracasts.com/images/logo/logo-triangle.svg" alt="Your Company" />
          </div>
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
              <a href="/" class="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Home</a>
              <a href="/about" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</a>
              <a href="/contact" class="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Contact</a>
            </div>
          </div>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
              <span class="absolute -inset-1.5"></span>
              <span class="sr-only">View notifications</span>
              <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
              </svg>
            </button>

            <!-- Profile dropdown -->
            <div class="relative ml-3">
              <div>
                <button type="button" class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span class="absolute -inset-1.5"></span>
                  <span class="sr-only">Open user menu</span>
                  <img class="size-8 rounded-full" src="https://laracasts.com/images/lary-ai-face.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <button type="button" class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden" aria-controls="mobile-menu" aria-expanded="false">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">Open main menu</span>
            <!-- Menu open: "hidden", Menu closed: "block" -->
            <svg class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <!-- Menu open: "block", Menu closed: "hidden" -->
            <svg class="hidden size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu, show/hide based on menu state. -->
    <div class="md:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
        <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
        <a href="/" class="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Home</a>
        <a href="/about" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">About</a>
        <a href="/contact" class="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Contact</a>
      </div>
      <div class="border-t border-gray-700 pt-4 pb-3">
        <div class="flex items-center px-5">
          <div class="shrink-0">
            <img class="size-10 rounded-full" src="https://laracasts.com/images/lary-ai-face.svg" alt="">
          </div>
          <div class="ml-3">
            <div class="text-base/5 font-medium text-white">Lary Robot</div>
            <div class="text-sm font-medium text-gray-400">andrea@laracasts.com</div>
          </div>
          <button type="button" class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
            <span class="absolute -inset-1.5"></span>
            <span class="sr-only">View notifications</span>
            <svg class="size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>

  <header class="bg-white shadow-sm">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ $heading }}</h1>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {{ $slot }}
    </div>
  </main>
</div>


</body>

</html>
```