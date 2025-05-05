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

### 1. Idioma del código

- Utilizar **inglés** para nombres de variables, componentes, funciones, hooks, props, etc.
- **Español solo en comentarios**, si es necesario para el equipo.

### 2. Nomenclatura

#### Variables

- `camelCase` para variables locales y propiedades.
- Nombres descriptivos y concisos.

```ts
const isLoading: boolean = true;
let userEmail: string = 'user@example.com';
```

#### Componentes

- `PascalCase` para nombres de componentes.
- Nombre que indique acción o comportamiento.
- Cada componente en su propio archivo.

```ts
function UserProfile() {
    return <div>User Profile</div>;
}
```

#### Props

- Tipos: `PascalCase` con sufijo `Props`.

```ts
type UserCardProps = {
    user: UserEntity;
    onDeleteUser: () => void;
};
```

#### Hooks personalizados

- Prefijo `use` y `camelCase`.

```ts
function useFetchUsers() { ... }
```

#### Constantes

- `UPPER_SNAKE_CASE`.

```ts
const API_URL = 'https://example.com/api';
```

#### Enums

- `PascalCase` para el nombre de las enumeraciones.
- `UPPER_SNAKE_CASE` para los valores.

```ts
enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}
```

### 3. Organización del proyecto

- Estructura por **feature** (feature-based).
- Componentes reutilizables en `/components/shared`.
- Hooks globales en `/hooks`.
- Utilidades en `/utils`.
- Tipos en `/types`.
- Servicios en `/services`

```
├── /src
│   └── /components
│   │   └── /shared
│   │   └── /Button
│   │       └── Button.tsx
│   │       └── Button.module.css
│   └── /features
│   │   └── /auth
│   │       └── AuthPage.tsx
│   │       └── AuthPage.module.css
│   │       └── hooks/
│   │       └── services/
│   └── /hooks
│   └── /utils
│   └── /types
    ...
```

### 4. Estilos de Código

- Usar TypeScript estricto (`strict: true`).
- Declarar tipos explícitamente.
- Preferir tipos (`type`) en lugar de `interface` para props.
- Evitar `any`; usar `unknown` si es necesario.

### 5. Buenas Prácticas

- Mantener componentes pequeños y reutilizables.
- Evitar lógica de negocio en componentes. Usar hooks o servicios.
- Desestructurar props y objetos cuando sea posible.
- Evitar comentarios innecesarios; el código debe ser autoexplicativo.
- Usar `Fragment` (<>) solo si es necesario.
- Prefiere composición sobre herencia.

### 6. Estilos

- Preferencia por CSS Modules o Tailwind CSS.
- Nombrar clases CSS en `kebab-case`.

```css
.button-primary { ... }
```

### 7. Testing

- Usar **Vitest** o **Testing Library** para pruebas unitarias.
- Archivos de test terminan en `.test.tsx` o `.spec.tsx`.

```tsx
describe('UserCard', () => {
  it('should render user name', () => {
    render(<UserCard name="Juan" age={30} />);
    expect(screen.getByText('Juan')).toBeInTheDocument();
  });
});
```

### 8. Control de Errores

- Manejar errores de red con `try/catch`.
- Mostrar errores de forma amigable al usuario.
- Centralizar manejo de errores en servicios o hooks.

---