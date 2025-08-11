[< Volver al índice](/docs/chapter/forms.md)

# Forms - Episodios 16 a 19

## 16. Episodio 16 - Forms and CSRF Explained (with Examples)
En este episodio aprendimos a cómo enviar un formulario en Laravel, qué es `CSRF`, cómo acceder a los atributos del request y la diferencia entre `fillable` y  `guarded`.

### ¿Cómo enviar un formulario? 
Para enviar un formulario en Laravel, usas una etiqueta `<form>` con `method="POST"` y defines la acción (`action`) hacia una ruta.
**Importante:** debes incluir el token CSRF con `@csrf`.

Ejemplo en la vista `create.blade.php` que se creó en la dirección `resources/jobs`:
```php
<x-layout>
    <x-slot:heading>
        Create Job
    </x-slot:heading>
    <form method="POST" action="/jobs">
        @csrf
```

### ¿Qué es CSRF?
CSRF significa Cross-Site Request Forgery (Falsificación de solicitudes entre sitios).
Laravel protege tus formularios de ataques CSRF mediante un token oculto que verifica que la solicitud proviene de tu propia aplicación.
Se incluye automáticamente en los formularios usando `@csrf`.

### ¿Cómo acceder a los atributos del request?
En nuestro archivo de rutas `web.php` añadimos la nuevva ruta:

```php
Route::post('/jobs', function(){
    // validation ...
    
    Job::create([
        'title' => request('title'),
        'salary' => request('salary'),
        'employer_id' => 1
    ]);

    return redirect('/jobs');
});
```

### ¿Cuál es la diferencia entre `fillable` y `guarded`?
Estas propiedades protegen contra la asignación masiva (mass assignment) en modelos Eloquent.

+ `fillable` define una lista blanca de campos que sí se pueden asignar en masa.
```php
protected $table = 'job_listings';
```

+ `guarded` define una lista negra de campos que no se pueden asignar en masa.
```php
protected $guarded = [];
```

## 17. Episodio 17 - Always Validate. Never Trust the User
En este episodio se abordó la validación de formularios en Laravel, tanto del lado del servidor como del cliente, y cómo mostrar errores de manera clara para el usuario.

### ¿Cómo agregar un botón para crear un Job?

En la cabecera (`header`) de tu layout puedes incluir un botón con Tailwind para dirigir al formulario de creación de empleos:
```php
<a href="/jobs/create" class="bg-blue-500 text-white px-4 py-2 rounded">Crear Job</a>
```
Este botón también se puede extraer como un componente Blade reutilizable.

### ¿Cómo definir la ruta para enviar el formulario?
Debes crear el archivo `button.blde.php` en la dirección `resources/views/components` para recibir los datos del formulario:
```php
<a {{ $attributes->merge(['class' => 'relative inline-flex items-center px-2 py-2 -ml-px text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md leading-5 hover:text-gray-400 focus:z-10 focus:outline-none focus:ring ring-gray-300 focus:border-blue-300 active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150 dark:bg-gray-800 dark:border-gray-600 dark:active:bg-gray-700 dark:focus:border-blue-800']) }}>{{ $slot }}</a>
```

Y en `layout.blade.php` agregar:
```php
<x-button href="/jobs/create">Create Jobs</x-button>
```

### Validación del lado del servidor
Para validar los datos del formulario, usa el método `validate()` en la función de la ruta:
```php
$request->validate([
    'title' => ['required', 'min:3'],
    'salary' => ['required'],
]);
```
Si la validación falla, Laravel redirige automáticamente con los mensajes de error.

### ¿Cómo mostrar errores de validación en Blade?
Errores globales:
```php
@if ($errors->any())
    <ul>
        @foreach ($errors->all() as $error)
            <li class="text-red-500">{{ $error }}</li>
        @endforeach
    </ul>
@endif
```

Errores especificos por campo de solicitud:
```php
@error('title')
    <p class="text-red-500 text-sm">{{ $message }}</p>
@enderror


@error('salary')
    <p class="text-red-500 text-sm">{{ $message }}</p>
@enderror
```

### Validación del lado del cliente
Puedes mejorar la experiencia del usuario agregando el atributo `required` a los campos en el formulario HTML. Esto activa la validación del navegador antes de enviar el formulario.
```html
<input type="text" name="title" id="title" placeholder="Shift Leader" required>
<input type="text" name="salary" id="salary" placeholder="$50,000 Per Year" required>
```

## 18. Episodio 18 - Editing, Update and Deleting a Resource
En este episodio completamos el ciclo CRUD de la aplicación de empleos, agregando la funcionalidad para **editar, actualizar y eliminar** registros en Laravel.

### ¿Cómo agregar un botón de edición?
En la vista `show.blade.php` puedes agregar un botón para editar un Job usando tu componente reutilizable:

```php
<x-button-link href="/jobs/{{ $job->id }}/edit">
    Editar Job
</x-button-link>
```
Este botón debe estar estilizado con Tailwind y ubicado de manera visible en la interfaz.

### ¿Cómo definir la ruta y vista de edición?
Se añade una ruta `GET` que carga el formulario con los datos del Job actual:
```php
Route::get('/jobs/{id}/edit', function ($id) {
    $job = Job::findOrFail($id);
    return view('jobs.edit', ['job' => $job]);
});
```
Y se crea la vista `edit.blade.php`, similar al formulario de creación, pero con los campos prellenados:
```php
<input type="text" name="title" value="{{ old('title', $job->title) }}" required>
<input type="text" name="salary" value="{{ old('salary', $job->salary) }}" required>
```

### ¿Cómo actualizar un Job?
Se define una ruta `PATCH` que recibe los datos actualizados:
```php
Route::patch('/jobs/{id}', function (Request $request, $id) {
    $request->validate([
        'title' => 'required|min:3',
        'salary' => 'required',
    ]);

    $job = Job::findOrFail($id);
    $job->update([
        'title' => $request->input('title'),
        'salary' => $request->input('salary'),
    ]);

    return redirect("/jobs/{$id}");
});
```
En el formulario de edición debes fingir el método PATCH con el siguiente Blade directive:
```php
<form method="POST" action="/jobs/{{ $job->id }}">
    @csrf
    @method('PATCH')
```
Esto le indica a Laravel que se trata de una actualización.

### ¿Cómo eliminar un Job?
Se crea una ruta `DELETE` que se encarga de eliminar el recurso:
```php
Route::delete('/jobs/{id}', function ($id) {
    $job = Job::findOrFail($id);
    $job->delete();

    return redirect('/jobs');
});
```
Como los formularios HTML no permiten métodos DELETE directamente ni pueden estar anidados, se utiliza un formulario oculto:
```php
<form id="delete-form" method="POST" action="/jobs/{{ $job->id }}">
    @csrf
    @method('DELETE')
</form>

<button form="delete-form" class="text-red-500">Eliminar Job</button>
```
Esto permite usar un botón visible para activar la eliminación.

##  19. Episodio 19 - Routes Reloaded - 6 Essential Tips
En este episodio nos enfocamos en mejorar el archivo de rutas (`web.php`) usando buenas prácticas que hacen que el código sea más **limpio, mantenible y eficiente**.

### 1. Route Model Binding
En lugar de buscar los modelos manualmente usando el `id`, Laravel permite usar **route model binding**, lo que hace que los modelos se inyecten automáticamente en tus rutas.

#### Antes:
```php
Route::get('/jobs/{id}', function ($id) {
    $job = Job::findOrFail($id);
    // ...
});
```

#### Después:
```php
Route::get('/jobs/{job}', function (Job $job) {
    // $job ya es una instancia del modelo
});
```

#### Claves:
+ El nombre del parámetro de ruta (`{job}`) debe coincidir con el nombre de la variable en la función.
+ Laravel buscará el modelo usando la llave primaria (`id` por defecto).

### 2. Controladores dedicados
En aplicaciones grandes, usar funciones anónimas para las rutas puede volverse difícil de mantener. Laravel recomienda usar controladores dedicados.

#### Crear un controlador:
```bash
php artisan make:controller JobController
```

#### Routes `view` y `resource`
```php
use App\Http\Controllers\JobController;
use Illuminate\Support\Facades\Route;

Route::view('/', 'home');
Route::view('/contact', 'contact');

Route::resource('jobs', JobController::class);
```

#### Listar rutas con Artisan
Puedes listar todas tus rutas con:
```bash
php artisan route:list
```

Y para excluir rutas de paquetes (`vendor`):
```bash
php artisan route:list --except=vendor
```
Esto es útil para auditar y organizar tus rutas.