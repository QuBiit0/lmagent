---
description: Reglas de estilo de código para archivos TypeScript/JavaScript
activation: glob
glob: "**/*.{ts,tsx,js,jsx}"
---

# Estilo de Código TypeScript

## Formato
- Usar `ESLint` + `Prettier`
- Line length: 100 caracteres
- Indent: 2 espacios
- Semicolons: sí
- Quotes: single

## Imports
```typescript
// Orden:
// 1. React/Next.js
// 2. Third party
// 3. Local absolute (@/)
// 4. Relative

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { formatDate } from './utils';
```

## Types
```typescript
// Interfaces para objetos
interface User {
  id: string;
  name: string;
}

// Types para uniones/aliases
type Status = 'pending' | 'completed' | 'failed';

// Props con interface
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}
```

## Components
```tsx
// Functional components con export nombrado
export function UserCard({ user }: { user: User }) {
  return (
    <div className="...">
      {user.name}
    </div>
  );
}
```

## Hooks
- Prefix: `use`
- Un hook por archivo en `hooks/`

## Tests
- Ubicar junto al archivo: `*.test.ts`
- O en `__tests__/`
- Usar React Testing Library

Para detalles completos ver `@/rules/code-style.md`
