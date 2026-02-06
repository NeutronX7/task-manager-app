<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Este seeder crea:
     * 1) Un usuario de prueba con credenciales conocidas
     * 2) Varias tareas asociadas a ese usuario
     *
     * Esto permite que el evaluador pueda:
     * - Iniciar sesión inmediatamente
     * - Probar el CRUD de tareas sin crear datos manualmente
     */
    public function run(): void
    {
        /**
         * Usuario de prueba
         *
         * email: test@example.com
         * password: password
         */
        $user = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@bluemedical.com',
            'password' => Hash::make('password'),
        ]);

        /**
         * Tareas de ejemplo asociadas al usuario autenticado
         *
         * IMPORTANTE:
         * - El user_id se asigna desde backend (relación),
         *   no viene del cliente
         */
        Task::create([
            'user_id' => $user->id,
            'title' => 'Comprar insumos',
            'description' => 'Comprar café, azúcar y servilletas',
            'status' => 'pending',
        ]);

        Task::create([
            'user_id' => $user->id,
            'title' => 'Preparar reporte',
            'description' => 'Reporte semanal de tareas',
            'status' => 'in_progress',
        ]);

        Task::create([
            'user_id' => $user->id,
            'title' => 'Enviar correos',
            'description' => 'Enviar correos a clientes',
            'status' => 'completed',
        ]);
    }
}
