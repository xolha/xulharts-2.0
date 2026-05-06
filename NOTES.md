# Anotações de Aprendizado — Next.js App Router

---

## Server Component vs Client Component

### Server Component (padrão)

```tsx
// SEM "use client" no topo
// função PODE ser async

export default async function Page() {
  const data = await db.select()... // busca direto no banco

  return <div>{data.nome}</div>
}
```

**Roda no servidor.** O HTML chega pronto para o browser — sem loading, sem flash de conteúdo vazio.

| Pode usar | Não pode usar |
|---|---|
| `async/await` direto | `useState` |
| Queries no banco | `useEffect` |
| Variáveis de ambiente secretas | `onClick`, `onChange` |
| Imports pesados (sem impacto no bundle) | Qualquer hook |

---

### Client Component

```tsx
"use client" // ← obrigatório no topo

import { useState } from "react"

export default function Componente() {
  const [aberto, setAberto] = useState(false)

  return <button onClick={() => setAberto(true)}>...</button>
}
```

**Roda no browser.** Tem acesso à interatividade.

| Pode usar | Não pode usar |
|---|---|
| `useState`, `useEffect` | `async/await` direto na função |
| `onClick`, eventos | Queries no banco |
| Hooks em geral | Variáveis de ambiente secretas |

---

### Regra prática

> Começa sempre **sem** `"use client"`. Só adiciona quando precisar de interatividade — estado que muda, cliques, formulários.

---

### O padrão usado no projeto

```
page.tsx (Server Component)
  → busca dados no banco com await
  → passa como props para ↓

ImageGrid.tsx (Client Component)
  → recebe dados prontos via props
  → gerencia lightbox com useState
```

O Server Component entrega os dados prontos. O Client Component não busca nada — só reage ao usuário.

---

## Fetching de dados

### Antes (useEffect — Client Component)

```
1. servidor envia HTML vazio + JavaScript
2. browser baixa e executa o JavaScript
3. React monta o componente
4. useEffect roda → faz fetch para a API
5. API consulta o banco
6. estado atualiza → conteúdo aparece
```
Usuário fica vendo tela vazia enquanto tudo isso acontece.

### Depois (Server Component)

```
1. servidor executa o componente → consulta o banco direto
2. servidor monta o HTML com os dados já lá
3. browser recebe a página pronta
```
Zero loading visível.

---

## Animações com Framer Motion

### Instalar
```bash
npm install framer-motion
```

### Uso básico (só em Client Components)

```tsx
"use client"
import { motion } from "framer-motion"

<motion.div
  initial={{ opacity: 0, y: -40 }}  // estado inicial (invisível, 40px acima)
  whileInView={{ opacity: 1, y: 0 }} // estado ao entrar na tela
  transition={{ duration: 0.8 }}
  viewport={{ once: true }}          // anima só uma vez
>
  conteúdo
</motion.div>
```

### Direções do `y`

| Valor | Efeito |
|---|---|
| `y: -40` → `y: 0` | Vem de cima para baixo (fade in down) |
| `y: 40` → `y: 0` | Vem de baixo para cima (fade in up) |

### Animação por seção (scroll trigger)

Para cada seção animar separadamente ao rolar, cada uma precisa do seu próprio `motion.div` com `whileInView`. Se você envolver tudo em um único `motion.div`, todas animam juntas quando a primeira aparecer.

```tsx
// ✅ cada um anima quando entra na tela
<motion.div whileInView={...}>coluna 1</motion.div>
<motion.div whileInView={...}>coluna 2</motion.div>

// ❌ tudo anima junto
<motion.div whileInView={...}>
  <div>coluna 1</div>
  <div>coluna 2</div>
</motion.div>
```

---

## Drizzle ORM

Drizzle é o ORM (biblioteca de queries) que conecta ao banco Neon (PostgreSQL).

### Buscar um registro

```ts
const [resultado] = await db
  .select({ campo: tabela.campo })
  .from(tabela)
  .where(eq(tabela.coluna, 'valor'))
  .limit(1)
```

### Buscar vários com condição OR

```ts
const resultados = await db
  .select({ slot: heroImages.slot, url: heroImages.url })
  .from(heroImages)
  .where(or(
    eq(heroImages.slot, 'home_emotes'),
    eq(heroImages.slot, 'home_badges'),
  ))
```

### Transformar array em objeto (para fácil acesso)

```ts
// array: [{ fieldKey: 'info_1', content: 'texto' }, ...]
// objeto: { info_1: 'texto', ... }
const contentMap = Object.fromEntries(
  rows.map(row => [row.fieldKey, row.content])
)

// uso: contentMap.info_1
```

### Duas queries em paralelo

```ts
const [imagens, textos] = await Promise.all([
  db.select()...,
  db.select()...,
])
```
