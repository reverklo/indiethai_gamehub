---
name: frontend-expert
description: Use when creating React/TypeScript components, pages, or features. For modern patterns including Suspense, useSuspenseQuery, lazy loading, MUI v7 styling, TanStack Router, and performance optimization.
---

# Frontend Expert

Modern React/TypeScript development patterns for high-performance applications.

## 🎯 Overview

This skill provides comprehensive guidelines for building production-grade React applications with:
- **Suspense-first architecture** - No loading spinners, no early returns
- **Type-safe patterns** - Strict TypeScript, no `any` types
- **Performance by default** - Lazy loading, memoization, cache strategies
- **Organized structure** - Feature-based directory organization

## 📋 Quick Start: Component Checklist

```markdown
- [ ] Use `React.FC\u003cProps\u003e` pattern with TypeScript
- [ ] Lazy load if heavy component: `React.lazy(() =\u003e import())`
- [ ] Wrap in `\u003cSuspenseLoader\u003e` for loading states
- [ ] Use `useSuspenseQuery` for data fetching
- [ ] Import aliases: `@/`, `~types`, `~components`, `~features`
- [ ] Styles: Inline if \u003c100 lines, separate file if \u003e100 lines
- [ ] Use `useCallback` for event handlers passed to children
- [ ] Default export at bottom
- [ ] No early returns with loading spinners
- [ ] Use `useMuiSnackbar` for user notifications
```

## 📋 Quick Start: Feature Checklist

```markdown
- [ ] Create `features/{feature-name}/` directory
- [ ] Create subdirectories: `api/`, `components/`, `hooks/`, `helpers/`, `types/`
- [ ] Create API service file: `api/{feature}Api.ts`
- [ ] Set up TypeScript types in `types/`
- [ ] Create route in `routes/{feature-name}/index.tsx`
- [ ] Lazy load feature components
- [ ] Use Suspense boundaries
- [ ] Export public API from feature `index.ts`
```

---

## 🧩 Import Aliases

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/` | `src/` | `import { apiClient } from '@/lib/apiClient'` |
| `~types` | `src/types` | `import type { User } from '~types/user'` |
| `~components` | `src/components` | `import { SuspenseLoader } from '~components/SuspenseLoader'` |
| `~features` | `src/features` | `import { authApi } from '~features/auth'` |

---

## 🚫 Critical Rules

### No Early Returns for Loading

```typescript
// ❌ NEVER - Causes layout shift
if (isLoading) {
    return \u003cLoadingSpinner /\u003e;
}

// ✅ ALWAYS - Consistent layout
\u003cSuspenseLoader\u003e
    \u003cContent /\u003e
\u003c/SuspenseLoader\u003e
```

### MUI v7 Grid Syntax

```typescript
\u003cGrid size={{ xs: 12, md: 6 }}\u003e  // ✅ v7 syntax
\u003cGrid xs={12} md={6}\u003e             // ❌ Old syntax
```

### API Route Format

```typescript
'/form/route'      // ✅ Correct
'/api/form/route'  // ❌ Wrong
```

---

## 📂 Topic Guides

### Component Patterns
- `React.FC\u003cProps\u003e` for type safety
- `React.lazy()` for code splitting
- Named const + default export pattern
- **[📖 Full Guide: references/component-patterns.md](references/component-patterns.md)**

### Data Fetching
- `useSuspenseQuery` as primary pattern
- Cache-first strategy
- API service layer in `features/{feature}/api/`
- **[📖 Full Guide: references/data-fetching.md](references/data-fetching.md)**

### File Organization
- `features/`: Domain-specific code
- `components/`: Truly reusable
- **[📖 Full Guide: references/file-organization.md](references/file-organization.md)**

### Styling with MUI v7
- `sx` prop with `SxProps\u003cTheme\u003e`
- Inline if \u003c100 lines, separate if \u003e100 lines
- **[📖 Full Guide: references/styling-guide.md](references/styling-guide.md)**

### TanStack Router
- Folder-based routing
- `createFileRoute` with lazy loading
- **[📖 Full Guide: references/routing-guide.md](references/routing-guide.md)**

### Loading \u0026 Error States
- SuspenseLoader for all loading states
- `useMuiSnackbar` for notifications
- **[📖 Full Guide: references/loading-and-error-states.md](references/loading-and-error-states.md)**

### Performance
- `useMemo` for expensive computations
- `useCallback` for handlers passed to children
- `React.memo` for expensive components
- **[📖 Full Guide: references/performance.md](references/performance.md)**

### TypeScript Standards
- Strict mode, no `any`
- Explicit return types
- Type imports with `import type`
- **[📖 Full Guide: references/typescript-standards.md](references/typescript-standards.md)**

### Common Patterns
- React Hook Form + Zod
- DataGrid wrappers
- Dialog standards
- **[📖 Full Guide: references/common-patterns.md](references/common-patterns.md)**

### Complete Examples
- Full component examples
- Feature structure template
- **[📖 Full Guide: references/complete-examples.md](references/complete-examples.md)**

---

## 🔧 Modern Component Template

```typescript
import React, { useState, useCallback } from 'react';
import { Box, Paper } from '@mui/material';
import { useSuspenseQuery } from '@tanstack/react-query';
import { featureApi } from '../api/featureApi';
import type { FeatureData } from '~types/feature';

interface MyComponentProps {
    id: number;
    onAction?: () =\u003e void;
}

export const MyComponent: React.FC\u003cMyComponentProps\u003e = ({ id, onAction }) =\u003e {
    const [state, setState] = useState\u003cstring\u003e('');

    const { data } = useSuspenseQuery({
        queryKey: ['feature', id],
        queryFn: () =\u003e featureApi.getFeature(id),
    });

    const handleAction = useCallback(() =\u003e {
        setState('updated');
        onAction?.();
    }, [onAction]);

    return (
        \u003cBox sx={{ p: 2 }}\u003e
            \u003cPaper sx={{ p: 3 }}\u003e
                {/* Content */}
            \u003c/Paper\u003e
        \u003c/Box\u003e
    );
};

export default MyComponent;
```

---

## 📚 Core Principles

1. **Lazy Load Everything Heavy** - Routes, DataGrid, charts, editors
2. **Suspense for Loading** - SuspenseLoader, not early returns
3. **useSuspenseQuery** - Primary data fetching pattern
4. **Features are Organized** - api/, components/, hooks/, helpers/ subdirs
5. **Styles Based on Size** - \u003c100 inline, \u003e100 separate
6. **Import Aliases** - Use @/, ~types, ~components, ~features
7. **No Early Returns** - Prevents layout shift
8. **useMuiSnackbar** - All user notifications