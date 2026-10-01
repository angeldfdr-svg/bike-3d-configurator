# PROJECT_STATE — Bike Configurator 3D

Última atualização: 2026-10-01

## Objetivo
Criar um configurador premium de bicicletas com componentes intercambiáveis em 3D, preço e
peso em tempo real, regras explícitas de compatibilidade e uma arquitetura preparada para
serviços reais (API, base de dados, autenticação, persistência e partilha).

## Inspeção inicial
- `/home/user` estava vazio. Nenhum código, manifest, dependência local, modelo ou
  componente existente para reutilizar.
- Ferramentas disponíveis: Node.js 20.20.2, npm 10.8.2, Git 2.47.3, Python 3.13 com Pillow.
- **MCP: não há servidores ou ferramentas MCP expostos nesta sessão.**
- **ECC: nenhuma ferramenta ou configuração ECC exposta nesta sessão.** Nada foi simulado
  nem anunciado como usado; a verificação assenta em typecheck, lint, testes, build e smoke
  test reais.
- Git não estava inicializado no momento da inspeção; o repositório local foi criado depois.

## Arquitetura atual
```
src/
├─ app/              layout, metadata, landing page, /configurator, robots.ts, sitemap.ts, not-found.tsx
├─ assets/fonts/     Manrope auto-alojada (400–800)
├─ components/
│  ├─ ui/            Button, LinkButton, Badge (estilo shadcn/ui, sem dependência de slot)
│  ├─ layout/        SiteHeader, SiteFooter, BrandMark
│  ├─ home/          Hero, CategoryGrid, ProcessSection, CompatibilitySection, ClosingCta
│  ├─ configurator/  ConfiguratorView, StagePanel, CameraControls, CategoryPanel, SummaryPanel, RoadmapPanel
│  └─ 3d/            (Fases 4–5) ainda não criado
├─ config/           site.ts, configurator.ts (categorias, vistas, regras planeadas)
├─ data/catalog/     frames, wheelsets, groupsets, cranksets, handlebars, saddles, tires,
│                    accessories, index (catálogo tipado + validateCatalog lazy)
├─ lib/              catalog.ts (acessores puros e type guards), validation/catalog-schema.ts (Zod),
│                    utils.ts, site-url.ts
├─ store/            (Fase 3) ainda não criado
├─ services/         (futuro) persistência e API
└─ types/components.ts   modelo de domínio (ComponentBase + 8 subtipos + Component)
tests/catalog.test.ts   29 testes
public/images/       bike-hero.webp, bike-stage.webp, og-cover.jpg
docs/                TECHNICAL_ROADMAP.md
scripts/             smoke.mjs
```

## Tecnologias instaladas
Next.js 16.3.8, React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, ESLint 9.39.5,
eslint-config-next 16.3.8, Zod 4.6.5, Vitest 3.2.7, class-variance-authority, clsx,
tailwind-merge, lucide-react.

Ainda não instalado, por não ser necessário: Zustand (Fase 3), Three.js + React Three Fiber
+ Drei (Fases 4–5), Framer Motion (as animações atuais são CSS).

## Fase atual
**Fase 2 concluída e verificada.**

## Funcionalidades concluídas

**Fase 1** — Next.js App Router, TypeScript estrito, Tailwind 4 com design system,
landing page premium, shell do configurador, SEO completo, responsividade, smoke test.

**Fase 2 — modelo de dados e catálogo**
- `src/types/components.ts`: `ComponentBase` e os oito subtipos (`BikeFrame`, `Wheelset`,
  `Groupset`, `Crankset`, `Handlebar`, `Saddle`, `Tire`, `Accessory`), com `Component` como
  union discriminado por `category`.
- Unidades fixas no modelo: preço em **cêntimos** (inteiro), peso em **gramas** (inteiro),
  medidas em **milímetros**.
- Atributos técnicos que as regras de compatibilidade vão consumir: standard de movimento
  pedaleiro, sistema de travagem, núcleo de cassete, eixos, diâmetro de espigão, largura
  máxima de pneus, número de velocidades, abraçadeira do guiador, roda e TPI.
- Catálogo demonstrativo com **31 produtos** (4 quadros, 4 rodas, 4 grupos, 4 pedaleiros,
  4 guiadores, 3 selins, 4 pneus, 4 extras), cada um com especificações de exibição.
- Esquemas Zod por subtipo e para o catálogo completo, com caminho do campo inválido nas
  mensagens.
- Acessores puros em `src/lib/catalog.ts` (`allProducts`, `productsByCategory`,
  `findProductById`, `countByCategory`) e oito *type guards*. Recebem o catálogo como
  argumento, por isso servem dados locais hoje e payloads remotos amanhã.
- `validateCatalog()` com import dinâmico do Zod, para manter o Zod fora do bundle inicial
  do cliente.
- 29 testes em `tests/catalog.test.ts`.

## Verificações executadas
| Comando | Resultado |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 erros |
| `npx eslint .` | ✅ 0 erros, 0 avisos |
| `npx vitest run` | ✅ 29 passed, 0 failed |
| `npx next build --webpack` | ✅ 5 rotas estáticas |
| `npm run smoke` | ✅ 25 passed, 0 failed |

Problemas encontrados e corrigidos nesta fase:
1. `z.enum` com valores numéricos não funciona como esperado no Zod 4 — substituído por
   `z.union([z.literal(...)])` para `seatpostDiameter` e `clamp`.
2. `flatMap` sobre as chaves do catálogo produzia inferência incorrecta do tipo de retorno —
   substituído por ciclo explícito em `allProducts`.
3. *Type guards* de compilação não usados disparavam `noUnusedLocals` — passaram a um tipo
   exportado (`SchemaTypeGuards`).
4. Contagem de produtos no teste estava errada (29 vs 31) — corrigida.

## Decisões técnicas
- **Duas vistas de dados por produto**: `specifications` (exibição) e atributos estruturados
  (regras). Um teste garante que não divergem.
- **Unidades no modelo**, não na UI: cêntimos e gramas evitam aritmética de ponto flutuante
  e obrigam a formatar só na apresentação (Fase 6).
- **Compatibilidade por atributos**, não por listas de IDs: as regras comparam standards
  (travão, BB, núcleo, eixo, espigão, largura de pneu, velocidades), o que escala para
  catálogos novos sem reescrever regras.
- **Catálogo fictício e identificado como tal**: marcas (`VELOCE`, `Ardent`, `Northwind`,
  `Meridian`, `Voltaic`, `Cinder`), produtos e preços são ilustrativos. Evita inventar
  especificações e preços para produtos comerciais reais.
- **Zod importado dinamicamente** pelo catálogo: validação disponível para testes e para a
  futura fronteira de API, sem peso no bundle do cliente.
- **Vitest adicionado nesta fase** (não na Fase 10) porque a integridade do catálogo é
  pré-requisito das Fases 6 e 7.

## Problemas conhecidos
- Ambiente de build com 2 vCPU e 2 GB RAM: builds longos podem ser lentos (webpack compilou
  em ~20 s).
- Nenhum produto tem `image`; o campo existe no modelo e a UI terá de renderizar um
  *fallback* quando as fases 5/9 chegarem.
- Sem MCP/ECC disponíveis nesta sessão.
- Sem remoto GitHub configurado: `git push` precisa do repositório e credenciais do
  utilizador.

## Próximo passo recomendado
Iniciar a **Fase 3 — estado global com Zustand**: store tipado com seleção por categoria,
configuração atual, tamanho de quadro, extras com quantidade, estado de carregamento,
câmara e configuração guardada; ações e seletores granulares; persistência local atrás de
uma interface (sem backend). Testes de seleção, reset, configuração inicial e invariantes
antes de ligar qualquer UI.
