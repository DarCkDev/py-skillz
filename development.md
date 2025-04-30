# ESTÁNDARES DE CODIFICACIÓN

## BACKEND (NESTJS)

### 1. Idioma del código
- Utilizar **inglés** para nombres de variables, funciones, clases, interfaces, etc.
- **Español solo en comentarios**, si es necesario para el equipo.

### 2. Nomenclatura

#### Variables

- `camelCase` para variables locales y propiedades.
- Nombres descriptivos y concisos.

```ts
const userId: number = 5;
let isActive: boolean = true;
```

#### Funciones y Métodos

- `camelCase`.
- Nombre que indique acción o comportamiento.

```ts
getUserById(id: number): UserEntity;
updateProfile(userDto: UpdateUserDto): Promise<void>;
```

#### Clases

- `PascalCase`.
- Nombre singular y representativo.

```ts
class UserService {}
class AuthController {}
```

#### Interfaces

- Prefijo `I` + `PascalCase`.

```ts
interface IUser {}
interface IJwtPayload {}
```

#### Data Transfer Objects (DTOs)

- Sufijo `Dto`.
- `PascalCase`

```ts
class CreateUserDto {}
class UpdateProductDto {}
```

#### Enumeraciones

- `PascalCase` para el nombre de las enumeraciones.
- `UPPER_SNAKE_CASE` para los valores.

```ts
enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}
```

#### Constantes

- `UPPER_SNAKE_CASE`.

```ts
const JWT_SECRET = 'supersecret';
const MAX_RETRIES = 3;
```

#### Organización del proyecto

- Estructura **modular** (feature-based).
- DTOs y validaciones en carpetas `/dto`.
- Pipes, interceptores y guards en sus propias carpetas.

```
├── /src
│   └── /auth
│       └── auth.module.ts
│       └── auth.controller.ts
│       └── auth.service.ts
│       └── dto/
│       └── guards/
│   └── /users
    ...
```

### 3. Buenas Prácticas

- Usar decoradores de NestJS correctamente (`@Injectable()`, `@Controller()`, etc.).
- Evitar nombres genéricos como data, item, result, etc.
- Preferentemente usar `readonly` cuando sea posible en propiedades de clases.
- Usar tipado estricto siempre (`strict: true` en `tsconfig.json`).
- Validar entradas con `class-validator` y `class-transformer`.

### 4. Documentación y Comentarios

- Usar comentarios solo si el código no es autoexplicativo.

```ts
/**
 * Recupera un usuario por su identificador único.
 * @param id - ID del usuario
 * @returns El usuario (entidad)
 */
getUserById(id: number): Promise<UserEntity>
```

### 5. Testing

- Realizar pruebas unitarias preferentemente con **Vitest** o con **Jest**.
- Nombrar archivos de test: `*.spec.ts`.

---

## FRONTEND (REACTJS)