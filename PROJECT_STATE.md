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
│  ├─ ui/            Button, LinkButton, Badge
│  ├─ layout/        SiteHeader, SiteFooter, BrandMark
│  ├─ home/          Hero, CategoryGrid, ProcessSection, CompatibilitySection, ClosingCta
│  ├─ configurator/  ConfiguratorView, StagePanel, CameraControls, CategoryPanel,
│  │                 SummaryPanel, RoadmapPanel, ConfigurationStatus
│  └─ 3d/            (Fases 4–5) ainda não criado
├─ config/           site.ts, configurator.ts
├─ data/catalog/     frames, wheelsets, groupsets, cranksets, handlebars, saddles, tires,
│                    accessories, index
├─ lib/              catalog.ts, configuration.ts, validation/ (catálogo + configuração),
│                    utils.ts, site-url.ts
├─ store/
│  ├─ bike-store.ts       store Zustand (factory + singleton lazy + hook)
│  └─ repositories.ts     ConfigurationRepository: localStorage / memória
├─ services/         (futuro) persistência e API
└─ types/            components.ts (domínio), configuration.ts (estado)
tests/               catalog.test.ts, configuration.test.ts, bike-store.test.ts (72 testes)
public/images/       bike-hero.webp, bike-stage.webp, og-cover.jpg
docs/                TECHNICAL_ROADMAP.md
scripts/             smoke.mjs
```

## Tecnologias instaladas
Next.js 16.3.8, React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, ESLint 9.39.5,
eslint-config-next 16.3.8, Zod 4.6.5, Zustand 5.0.15, Vitest 3.2.7, class-variance-authority,
clsx, tailwind-merge, lucide-react.

Ainda não instalado, por não ser necessário: Three.js + React Three Fiber + Drei
(Fases 4–5), Framer Motion (as animações atuais são CSS).

## Fase atual
**Fase 3 concluída e verificada.**

## Funcionalidades concluídas

**Fase 1** — Next.js App Router, TypeScript estrito, Tailwind 4 com design system, landing
page premium, shell do configurador, SEO completo, responsividade, smoke test.

**Fase 2** — modelo de domínio (`ComponentBase` + 8 subtipos, union discriminado),
catálogo de 31 produtos demonstrativos, atributos técnicos para compatibilidade, esquemas
Zod, acessores puros, type guards.

**Fase 3 — estado global**
- `src/types/configuration.ts`: `BikeConfiguration` (ids + tamanho do quadro + extras com
  quantidade), `CameraState`, `SavedConfiguration`, `ConfigurationStatus`,
  `componentSlots`.
- `src/lib/configuration.ts`: helpers puros (`emptyConfiguration`, `configurationIds`,
  `isConfigurationComplete`, `resolveFrameSize`, `addAccessory`, `setAccessoryQuantity`,
  `removeAccessory`, `danglingIds`).
- `src/lib/validation/configuration-schema.ts`: schema versionado (`version: 1`) para
  configurações e configurações guardadas, serialização e parse com rejeição de payloads
  inválidos.
- `src/store/repositories.ts`: interface `ConfigurationRepository` (assíncrona, para
  suportar API no futuro) com implementações `localStorage`, memória e
  `createBrowserRepository` com degradação segura em SSR.
- `src/store/bike-store.ts`: store criado por fábrica (`createBikeStore({ repository,
  catalog })`), singleton lazy (`getBikeStore`) que não toca em `localStorage` durante SSR,
  e hook `useBikeStore` com seletores granulares.
- Ações: seleção por categoria, `setFrameSize`, `toggleAccessory`,
  `setAccessoryQuantity`, `removeAccessory`, `setCameraView`, `toggleAutoRotate`,
  `resetConfiguration`, `hydrate`, `saveConfiguration`, `restoreSavedConfiguration`,
  `clearSavedConfiguration`.
- Integração mínima e honesta na UI: `ConfigurationStatus` lê o estado real
  (`N/7 componentes · extras · status`) e dispara a hidratação no mount. Nenhum valor
  fictício foi introduzido.

## Verificações executadas
| Comando | Resultado |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 erros |
| `npx eslint .` | ✅ 0 erros, 0 avisos |
| `npx vitest run` | ✅ 72 passed, 0 failed (3 ficheiros) |
| `npx next build --webpack` | ✅ 5 rotas estáticas |
| `npm run smoke` | ✅ 25 passed, 0 failed |
| Bundle | chunk do Zod confirmado como não carregado no primeiro paint |

Problemas encontrados e corrigidos nesta fase:
1. Parâmetros `set`/`get` sem tipo na *state creator* — resolvido tipando o retorno como
   `StateCreator<BikeStore, [], []>`.
2. Zod entrava no bundle inicial do cliente através do repositório — passou a import
   dinâmico, mantido fora do primeiro paint.
3. `serializeConfiguration` produzia um payload sem `savedAt`, que o schema rejeitava —
   separados `configurationPayloadSchema` e `savedConfigurationSchema`.

## Decisões técnicas
- **Store vanilla + hook**: `createStore` com injeção de dependências. Testa-se o
  comportamento sem React nem DOM; a UI subscreve por seletores.
- **Configuração guarda ids, não produtos**: pequena, serializável para URL/base de dados e
  resistente a mudanças de catálogo.
- **Repositório assíncrono**: trocar `localStorage` por API não altera o store.
- **Payload versionado** (`version: 1`): permite migração futura sem quebrar
  configurações antigas.
- **Ids desconhecidos são ignorados** pelo store, e payloads inválidos são rejeitados pelo
  Zod antes de chegarem ao estado.
- **Sem lógica de negócio no store**: preço, peso e compatibilidade chegam como funções
  puras em `src/lib` e serão ligadas por seletores nas Fases 6 e 7.
- **Singleton lazy**: `getBikeStore()` só cria o store no cliente, evitando acesso a
  `localStorage` durante SSR.

## Problemas conhecidos
- Ainda não há UI para selecionar componentes: o store está testado e integrado apenas na
  leitura de estado. A seleção visual chega com as listas de produtos (Fases 5–8).
- Nenhum produto tem `image`; a UI terá de renderizar um *fallback*.
- Ambiente de build com 2 vCPU e 2 GB RAM: builds longos podem ser lentos.
- Sem MCP/ECC disponíveis nesta sessão.
- Sem remoto GitHub configurado.

## Próximo passo recomendado
Iniciar a **Fase 4 — cena 3D**: instalar Three.js, React Three Fiber e Drei; `Canvas` lazy
com Suspense; fallback acessível quando WebGL não está disponível; `OrbitControls` com
rotação, zoom e pan; bicicleta procedural centrada; vistas predefinidas ligadas ao
`camera` do store. Verificar typecheck, lint, testes, build e smoke antes de avançar.
