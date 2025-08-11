[< Volver al índice](/docs/chapter/auth.md)

# Authentication - Episodios 20 a 23

## 20. Episodio 20 - Starter Kits. Breeze and Middleware
En este episodio iniciamos un nuevo capítulo enfocado en la autenticación en Laravel. Aprendimos a utilizar Laravel Breeze, un starter kit oficial que permite implementar rápidamente las funciones básicas de autenticación como registro, login, edición de perfil y cierre de sesión.

> Todo lo que se implementó en este episodio fue únicamente con fines demostrativos y educativos. No es parte del proyecto real.

### ¿Qué es Laravel Breeze?
Laravel Breeze es un starter kit ligero que configura de forma automática las siguientes características:
+ Formularios de registro y login.
+ Pantalla de dashboard accesible solo para usuarios autenticados.
+ Edición de perfil y actualización de contraseña.
+ Funcionalidad de logout.
+ Middleware que protege rutas y redirige a los invitados.

### ¿Cómo instalar Breeze?
Se parte de un proyecto nuevo de Laravel. Ejecuta en la terminal:
```bash
laravel new app
```
Durante la configuración, selecciona Breeze como el starter kit. Luego, ejecuta:
```bash
php artisan serve
```
O accede vía Laravel Herd. Verás enlaces a login y registro automáticamente disponibles.

### Stack de frontend
Breeze es compatible con distintas opciones de frontend: Blade + JavaScript, Vue, React o Livewire.
En el ejemplo de este episodio se utilizó el stack por defecto (Blade), sin soporte para dark mode.

### ¿Cómo funciona la autenticación con Breeze?
Laravel Breeze protege las rutas usando middleware como `auth` y `verified`, asegurando que solo los usuarios autenticados puedan acceder a ciertas páginas.
+ Puedes acceder al usuario autenticado con el helper `auth()->user()` o con la facade `Auth::user()`.
+ Breeze utiliza componentes Blade reutilizables para formularios, etiquetas, validaciones, layouts, etc.
+ El proceso de registro incluye:
  - Validación de datos
  - Encriptación de contraseña
  - Disparo de eventos (`Registered`)
  - Autenticación automática tras el registro

### ¿Qué es un middleware?
Un middleware actúa como una capa intermedia que procesa las solicitudes antes de llegar al núcleo de tu aplicación.
Ejemplo: el middleware `auth` verifica si el usuario está autenticado. Si no lo está, lo redirige al login.
```php
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function () {
        // Solo usuarios autenticados
    });
});
```

## 21. Episodio 21 - Make a Login and Registration System From Scratch: Part 1
En este episodio aprendimos a implementar manualmente los formularios de registro y login en Laravel, sin utilizar ningún starter kit como Breeze. Esto permite entender a profundidad cómo funcionan los formularios, los componentes Blade y el proceso de autenticación.

### ¿Cómo crear componentes Blade reutilizables para formularios?
Para evitar repetir código, se crearon componentes en `resources/views/components`:
+ `form-label.blade.php` → Etiquetas de formulario (`<label>`)
+ `form-input.blade.php` → Campos de entrada (`<input>`)
+ `form-error.blade.php` → Mostrar errores de validación por campo
Ejemplo de uso del formulario `form-input.blade.php`: 
```php
<div
    class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
    <input {{ $attributes->merge(['class'=>'block min-w-0 grow py-1.5 pr-3 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6']) }}/>
</div>
```
Cada componente acepta  atributos y `slots`, lo que los hace más fleaxibles y reutilizables.

### ¿Cómo construir las vistas de login y registro?
Se crearon dos archivos de vista dentro de resources/views/auth:
+ `register.blade.php`
+ `login.blade.php`

Ambos formularios usaron los componentes de formulario creados anteriormente.
Campos comunes incluidos:
+ Nombre
+ Apellido
+ Correo electrónico
+ Contraseña
+ Confirmación de contraseña
También se incluyeron los atributos `required` para validar del lado del cliente.

### ¿Cómo definir rutas y controladores de autenticación?
En el archivo `web.php` se añadieron las siguientes rutas:
```php
use App\Http\Controllers\RegisteredUserController;
use App\Http\Controllers\SessionController

//Auth
Route::get('/register', [RegisteredUserController::class, 'create']);
Route::post('/register', [RegisteredUserController::class, 'store']);

Route::get('/login', [SessionController::class, 'create']);
Route::post('/login', [SessionController::class, 'store']);
```
Se crearon dos controladores personalizados con sus métodos respectivos:
+ `RegisteredUserController` → `create()` y `store()`
+ `SessionController` → `create()` y `store()`
Esto permite tener mayor control sobre la lógica de autenticación.

### ¿Cómo mostrar enlaces de login/registro solo para invitados?
Laravel ofrece directivas Blade para mostrar contenido de forma condicional según el estado de autenticación:
```php
@guest
  <x-nav-link href="/login" :active="request()->is('login')">Log In</x-nav-link>
  <x-nav-link href="/register" :active="request()->is('register')">Register</x-nav-link>
@endguest
```

## 22. Episodio 22 - Make a Login and Registration System From Scratch: Part 2
En este episodio se implementó manualmente la lógica del registro e inicio de sesión en Laravel, sin usar ningún starter kit. Se trabajó directamente con la validación de formularios, creación de usuarios, autenticación y manejo de sesiones.

### Proceso de Registro
Cuando un usuario envía el formulario de registro, se siguen estos pasos:
1. **Validación**
Se usa el método `$request->validate()` para asegurarse de que los campos requeridos cumplan ciertas reglas.
```php
$atributes = request()->validate([
  'first_name' => ['required'],
  'last_name' => ['required'],
  'email' => ['required', 'email'],
  'password' => ['required', Password::min(6), 'confirmed'],
]);
```

2. **Creación de Usuario**
Una vez validados los datos, se crea el usuario en la base de datos:
```php
$user = User::create($atributes);
```
> Laravel se encarga de **hashear automáticamente** la contraseña si el modelo `User` tiene el atributo `password` dentro del arreglo `$casts`.

3. **Iniciar Sesión**
Después de crear el usuario, se inicia sesión automáticamente con:
```php
Auth::login($user);
```

4. **Redirección**
Finalmente, se redirige al usuario a la página deseada:
```php
return redirect('/jobs');
```

### Proceso de Inicio de Sesión
Cuando un usuario envía el formulario de login, se sigue este flujo:

1. **Validación**
Se validan los campos `email` y `password`:
```php
$attributes = request()->validate([
  'email' => ['required', 'email'],
  'password' => ['required'],
]);
```

2. **Intento de Autenticación**
Se usa `Auth::attempt()` para verificar las credenciales:
```php
if (! Auth::attempt($attributes)){
  throw ValidationException::withMessages([
    'email' => 'Sorry, these credentials do not match our records.'
    ]);
};
```

### UX: Preservar campos tras errores
Para mejorar la experiencia de usuario, Laravel permite conservar los valores del formulario tras un error de validación usando `old()`:
```php
<x-form-input name="email" id="email" type="email" :value="old('email')" required />
```
> En componentes Blade debes anteponer `:` para interpretar como expresión

## 23. Episodio 23 - 6 Steps to Autorization Mastery
En este episodio aprendimos a manejar la autorización en Laravel, es decir, cómo controlar qué usuarios pueden realizar ciertas acciones, como editar o eliminar recursos. Se abordó el tema en pasos claros y progresivos.

### Paso 1: Relaciones necesarias para la autorización
Para poder autorizar correctamente a un usuario sobre un recurso (por ejemplo, un Job), debe existir una relación clara entre el usuario y el recurso.
+ Se añadió una foreign key `user_id` a la tabla `employers`, para relacionar al empleador con un usuario.
+ Se actualizó la factory de Employer para que cada empleador creado esté vinculado a un usuario.
Esto permite recorrer la relación desde un `Job` hasta su `Employer`, y de ahí al `User`.

### Paso 2: Autorización directa en el controlador
Se implementó una verificación manual en el método `edit()` del `JobController`:
```php
if (auth()->guest()) {
    return redirect('/login');
}

if (!auth()->user()->is($job->employer->user)) {
    abort(403);
}
```
Esto garantiza que solo el dueño del recurso pueda editarlo.

### Paso 3: Gates (puertas de autorización)
Para mejorar la legibilidad y reutilización, se extrajo la lógica de autorización a **Gates**.
**Se crean en `App\Providers\AppServiceProvider.php`**:
```php
use Illuminate\Support\Facades\Gate;

Gate::define('edit-job', function (User $user, Job $job) {
    return $user->is($job->employer->user);
});
```

**Se usan en el controlador**:
```php
Gate::authorize('edit-job', $job); // Lanza 403 automáticamente si falla
```
También se puede usar:
+ `Gate::allows('edit-job', $job)` → devuelve `true` o `false`
+ `Gate::denies('edit-job', $job)` → lo contrario

### Paso 4: Métodos `can` y `cannot` en el modelo `User`
Laravel añade automáticamente métodos `can()` y `cannot()` al modelo `User`.
Se puede usar en controladores o vistas Blade:
```php
@can('edit-job', $job)
    <a href="/jobs/{{ $job->id }}/edit">Editar Job</a>
@endcan
```

### Paso 5: Middleware de autorización en rutas
También se puede aplicar la autorización directamente en la definición de rutas:
```php
Route::get('/jobs', [JobController::class, 'index']);
Route::get('/jobs/create', [JobController::class, 'create']);
Route::post('/jobs', [JobController::class, 'store'])->middleware('auth');
Route::get('/jobs/{job}', [JobController::class, 'show']);

Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])
    ->middleware('auth')
    ->can('edit', 'job');

Route::put('/jobs/{job}', [JobController::class, 'update'])
    ->middleware('auth')
    ->can('edit-job', 'job');

Route::delete('/jobs/{job}', [JobController::class, 'destroy'])
    ->middleware('auth')
    ->can('edit-job', 'job');
```
Esto asegura que el usuario esté autenticado y autorizado antes de ejecutar el controlador.

Se puede aplicar middleware a rutas individuales o agruparlas.

### Paso 6: Policies (políticas)

Las **Policies** son clases dedicadas a encapsular reglas de autorización por modelo.

**Creación de una Policy**

Para crear una policy, se puede usar el comando Artisan:
```bash
php artisan make:policy JobPolicy --model=Job
```

**Dentro de la Policy**

Se define un método `edit()` que recibe el usuario y el job:
```php
public function edit(User $user, Job $job)
{
    return $user->is($job->employer->user);
}
```

**Registrar la policy**

En `App\Providers\AuthServiceProvider.php`, se registra la policy:

```php
protected $policies = [
    Job::class => JobPolicy::class,
];
```

**Usar  en Blade o controlador**

```php
@can('edit', $job)
    <x-button-link href="/jobs/{{ $job->id }}/edit">Editar Job</x-button-link>
@endcan
```
