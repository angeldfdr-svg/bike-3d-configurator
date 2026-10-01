# Bike Configurator 3D

> **BUILD YOUR BIKE** — Cria a tua bicicleta. Escolhe cada componente. Constrói algo único.

Configurador web de bicicletas de gama alta: o utilizador escolhe quadro, rodas, grupo,
pedaleiro, guiador, selim, pneus e extras, e vê a bicicleta mudar em 3D enquanto o preço,
o peso, as especificações e a compatibilidade são recalculados em tempo real.

O projeto está a ser construído por fases, com verificação no fim de cada fase. Este
repositório contém a **Fase 1**: arquitetura, configuração e interface inicial.

---

## Estado atual

| | |
| --- | --- |
| Fase | **1 de 11** — arquitetura, configuração inicial e UI inicial |
| Build | `next build` ✅ (5 rotas estáticas) |
| Typecheck | `tsc --noEmit` ✅ (TypeScript estrito) |
| Lint | `eslint .` ✅ (0 erros, 0 avisos) |
| Smoke test | `npm run smoke` ✅ (25 verificações) |

Ainda **não** existem catálogo de produtos, estado global, cena 3D, preço, peso ou motor de
compatibilidade. A interface mostra a estrutura final dessas áreas e identifica em que fase
cada uma entra — nada é simulado.

---

## Stack

| Tecnologia | Uso |
| --- | --- |
| **Next.js 16** (App Router) | Roteamento, rendering, metadata, `robots`/`sitemap` |
| **React 19** | Componentes de interface |
| **TypeScript 5.9** (estrito) | Tipos em todo o projeto, `noUncheckedIndexedAccess`, `noUnusedLocals` |
| **Tailwind CSS 4** | Design system em `src/app/globals.css` (`@theme`) |
| **Componentes UI** | Primitivas próprias ao estilo shadcn/ui (`Button`, `Badge`, `LinkButton`) |
| **Lucide** | Ícones |
| **Tipografia** | Manrope auto-alojada em `src/assets/fonts` (sem CDN em runtime) |

Planeado e ainda não instalado, por não ser necessário nesta fase:

| Tecnologia | Fase |
| --- | --- |
| Zustand | 3 |
| Three.js + React Three Fiber + Drei | 4 e 5 |
| Zod | 2 (validação de catálogo e persistência) |

---

## Instalação

Requisitos: **Node.js >= 20.9** e npm.

```bash
git clone <url-do-repositorio>
cd bike-configurator-3d
npm install
cp .env.example .env.local   # opcional: definir NEXT_PUBLIC_SITE_URL
```

## Execução

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build de produção
npm start          # servidor de produção (porta 3000)
```

Verificações:

```bash
npm run typecheck  # TypeScript estrito
npm run lint       # ESLint
npm run smoke      # build + arranque do servidor + verificações de rota/SEO/assets
```

`npm run smoke` arranca o servidor de produção numa porta livre, valida as rotas, os
endpoints de SEO e os assets, e encerra o servidor. Use `SMOKE_PORT=3210 npm run smoke`
para mudar de porta.

---

## Arquitetura

```
src/
├─ app/                     # App Router: layout, metadata, páginas, robots, sitemap
│  ├─ layout.tsx            # fonte, metadata, skip link, header/footer
│  ├─ page.tsx              # landing page
│  ├─ configurator/page.tsx # shell do configurador
│  ├─ robots.ts             # robots.txt
│  ├─ sitemap.ts            # sitemap.xml
│  └─ not-found.tsx         # 404
├─ assets/fonts/            # Manrope auto-alojada
├─ components/
│  ├─ ui/                   # primitivas de design system (Button, Badge, LinkButton)
│  ├─ layout/               # header, footer, marca
│  ├─ home/                 # secções da landing page
│  ├─ configurator/         # shell, palco, categorias, resumo, roadmap
│  └─ 3d/                   # (Fases 4–5) cena e peças
├─ config/                  # dados de estrutura: site, categorias, regras planeadas
├─ lib/                     # utilitários partilhados (cn, siteUrl)
├─ data/                    # (Fase 2) catálogo de produtos
├─ store/                   # (Fase 3) Zustand
└─ services/                # (futuro) persistência e API
```

### Limites de responsabilidade

- **UI** nunca contém regras de negócio: preço, peso e compatibilidade viverão em
  `src/lib` como funções puras, testáveis sem React.
- **Dados** de produto são objetos tipados em `src/data`, nunca espalhados por componentes.
- **3D** é isolado em `src/components/3d` e comunica com a UI apenas através do estado.
- **Estado** global chega na Fase 3; até lá o único estado local é o acordeão de categorias.

### Design system

Os tokens vivem no bloco `@theme` de `src/app/globals.css`:

- superfícies `ink-*` (quase preto quente), linhas `line*`, texto `fog-*`, acento `lime-*`
- cantos ligeiramente arredondados (`rounded-xs` a `rounded-2xl`)
- microanimações (`animate-rise`, `animate-fade`) desativadas com
  `prefers-reduced-motion: reduce`
- foco visível consistente e *skip link* para o conteúdo principal

---

## Funcionalidades implementadas (Fase 1)

**Landing page**

- Hero com o título e subtato pedidos, chamada para ação e factos do produto
- Grelha das oito categorias de componentes
- Secção de processo em três passos
- Secção de compatibilidade com as regras planeadas e o formato de mensagem
- Fecho com chamada para ação

**Configurador (`/configurator`)**

- Estrutura em dois painéis: palco 3D + controlos de câmara à esquerda, categorias e
  resumo à direita
- Oito categorias em acordeão acessível (`aria-expanded`, `aria-controls`), com os
  atributos que cada produto vai mostrar
- Painel de resumo com preço total, peso total, especificações e compatibilidade
- Vistas de câmara (frontal, lateral, traseira, superior) presentes mas desativadas, com
  justificação explícita
- Painel de estado do projeto com as sete primeiras fases

**Base técnica**

- Metadata, Open Graph, Twitter Card, `robots.txt` e `sitemap.xml`
- `lang="pt-PT"`, *skip link*, landmarks, contraste e foco visível
- Responsivo: desktop, portátil, tablet e telemóvel (3D → componentes → resumo)
- Imagens optimizadas com `next/image`, fonte auto-alojada, sem CDN em runtime

---

## Roadmap

| Fase | Conteúdo | Estado |
| --- | --- | --- |
| 1 | Arquitetura, configuração, UI inicial, SEO, README | ✅ concluída |
| 2 | Modelo de dados e catálogo (`ComponentBase`, `BikeFrame`, `Wheelset`, `Groupset`, `Crankset`, `Handlebar`, `Saddle`, `Tire`) | pendente |
| 3 | Zustand: seleção, configuração, loading, câmara, persistência | pendente |
| 4 | Cena 3D (React Three Fiber, Drei, Suspense, fallback de WebGL, vistas de câmara) | pendente |
| 5 | Peças 3D intercambiáveis + registry para GLB/GLTF lazy | pendente |
| 6 | Preço e peso em tempo real (funções puras + testes) | pendente |
| 7 | Motor de compatibilidade modular (regras, severidade, mensagens) | pendente |
| 8 | Responsividade do configurador (desktop split, mobile empilhado) | pendente |
| 9 | Microanimações, transições, estados vazios/erro/carregamento | pendente |
| 10 | Testes de domínio e interface, performance 3D | pendente |
| 11 | Limpeza, revisão final, preparação para deploy | pendente |

O detalhe de cada fase, com critérios de saída, está em
[`docs/TECHNICAL_ROADMAP.md`](docs/TECHNICAL_ROADMAP.md). O estado vivo do projeto está em
[`PROJECT_STATE.md`](PROJECT_STATE.md).

---

## Preparação para funcionalidades futuras

A arquitetura já separa o que é preciso para suportar, sem implementar:

- **API e base de dados** — catálogo isolado em `src/data`, consumido por funções puras
- **Autenticação e checkout** — nenhum endpoint ou credencial fictícios; contratos só
  quando existirem serviços reais
- **Guardar e partilhar configurações** — a configuração será um objecto serializável e
  versionado, pronto para URL/localStorage/API
- **Comparação, favoritos, recomendações, pesquisa e filtros** — seletores sobre o catálogo
- **Modelos 3D realistas** — registry que associa IDs de produto a geometria procedural ou
  GLB carregado de forma lazy
- **PDF, inventário, várias marcas, personalização de cor** — camadas de dados e de
  apresentação já desacopladas

---

## Notas de engenharia

- **ESLint 9**: o plugin de React incluído no `eslint-config-next` 16 ainda chama
  `context.getFilename()`, removido no ESLint 10. A versão está fixa na linha 9.x.
- **Build**: o build foi validado com `next build --webpack`. O Turbopack (padrão do
  Next 16) também é suportado pelo script `npm run build`.
- **TypeScript estrito**: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`,
  `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.
- **Sem dependências supérfluas**: cada pacote instalado tem uso efectivo nesta fase.

## Aviso

Marca, produtos, preços e pesos são **fictícios e ilustrativos**. Nenhum componente,
especificação técnica ou preço aqui apresentado corresponde a produto real. Antes de uso
comercial é necessário substituir o catálogo por dados técnicos verificados.

## Licença

Projeto de demonstração, sem licença definida.
