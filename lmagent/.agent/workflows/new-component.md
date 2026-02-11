---
description: Workflow para crear un nuevo componente React
---

# New React Component Workflow

Usa este workflow para crear componentes React/Next.js.

## 1. Definir el Componente

- **Nombre**: PascalCase (e.g., `UserCard`)
- **Ubicación**: 
  - `components/ui/` para primitivos
  - `components/features/{feature}/` para específicos
- **Props**: ¿Qué recibe?

## 2. Crear Archivo

```bash
touch components/ui/user-card.tsx
```

## 3. Estructura Base

```tsx
// components/ui/user-card.tsx
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  variant?: 'default' | 'compact';
  className?: string;
  onClick?: () => void;
}

export function UserCard({
  user,
  variant = 'default',
  className,
  onClick,
}: UserCardProps) {
  return (
    <article
      className={cn(
        'rounded-lg border bg-card p-4',
        variant === 'compact' && 'p-2',
        className
      )}
      onClick={onClick}
    >
      <h3 className="font-medium">{user.name}</h3>
      <p className="text-sm text-muted-foreground">{user.email}</p>
    </article>
  );
}
```

## 4. Agregar Accesibilidad

- [ ] Roles ARIA si es interactivo
- [ ] Keyboard navigation
- [ ] Labels descriptivos
- [ ] Contraste de colores

## 5. Agregar Tests

```tsx
// __tests__/user-card.test.tsx
import { render, screen } from '@testing-library/react';
import { UserCard } from '../user-card';

const mockUser = { id: '1', name: 'John', email: 'john@test.com' };

describe('UserCard', () => {
  it('renders user info', () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

## 6. Export

```tsx
// components/ui/index.ts
export { UserCard } from './user-card';
```

## Checklist

- [ ] Props tipadas
- [ ] className aceptado
- [ ] Variantes si aplica
- [ ] Accesible
- [ ] Test escrito
- [ ] Exportado

Para más detalles ver `@/personas/frontend-engineer.md`
