# Bike Configurator 3D

> **BUILD YOUR BIKE** — Cria a tua bicicleta. Escolhe cada componente. Constrói algo único.

Configurador web de bicicletas de gama alta: o utilizador escolhe quadro, rodas, grupo,
pedaleiro, guiador, selim, pneus e extras, e vê a bicicleta mudar em 3D enquanto o preço,
o peso, as especificações e a compatibilidade são recalculados em tempo real.

O projeto está a ser construído por fases, com verificação no fim de cada fase. Este
repositório contém a **Fase 2**: modelo de dados, catálogo, validação e testes de
integridade.

---

## Estado atual

| | |
| --- | --- |
| Fase | **2 de 11** — modelo de dados e catálogo |
| Build | `next build` ✅ (5 rotas estáticas) |
| Typecheck | `tsc --noEmit` ✅ (TypeScript estrito) |
| Lint | `eslint .` ✅ (0 erros, 0 avisos) |
| Testes | `vitest run` ✅ (29 testes) |
| Smoke test | `npm run smoke` ✅ (25 verificações) |

Ainda **não** existem estado global, cena 3D, preço, peso ou motor de compatibilidade. A
interface mostra a estrutura final dessas áreas e identifica em que fase cada uma entra —
nada é simulado.

---

## Stack

| Tecnologia | Uso |
| --- | --- |
| **Next.js 16** (App Router) | Roteamento, rendering, metadata, `robots`/`sitemap` |
| **React 19** | Componentes de interface |
| **TypeScript 5.9** (estrito) | Tipos em todo o projeto, `noUncheckedIndexedAccess`, `noUnusedLocals` |
| **Tailwind CSS 4** | Design system em `src/app/globals.css` (`@theme`) |
| **Componentes UI** | Primitivas próprias ao estilo shadcn/ui (`Button`, `Badge`, `LinkButton`) |
| **Zod 4** | Contrato de validação do catálogo (runtime) |
| **Vitest 3** | Testes de integridade do catálogo e das regras de domínio |
| **Lucide** | Ícones |
| **Tipografia** | Manrope auto-alojada em `src/assets/fonts` (sem CDN em runtime) |

Planeado e ainda não instalado, por não ser necessário nesta fase: Zustand (Fase 3),
Three.js + React Three Fiber + Drei (Fases 4–5). A animação da landing page usa CSS, pelo
que Framer Motion não foi adicionado.

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
npm test           # Vitest (uma corrida)
npm run test:watch # Vitest em modo observação
npm run smoke      # build + arranque do servidor + verificações de rota/SEO/assets
```

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
├─ data/
│  └─ catalog/              # catálogo tipado por categoria + validação opcional
├─ lib/
│  ├─ catalog.ts            # acessores puros sobre o catálogo + type guards
│  ├─ validation/           # schemas Zod (contrato de runtime)
│  └─ utils.ts, site-url.ts
├─ store/                   # (Fase 3) Zustand
├─ services/                # (futuro) persistência e API
└─ types/
   └─ components.ts         # modelo de domínio
tests/
└─ catalog.test.ts          # integridade do catálogo e da validação
public/images/              # assets editoriais
docs/                       # roadmap técnico
scripts/                    # smoke test sem dependências
```

### Limites de responsabilidade

- **UI** nunca contém regras de negócio: preço, peso e compatibilidade viverão em
  `src/lib` como funções puras, testáveis sem React.
- **Dados** de produto são objetos tipados em `src/data`, nunca espalhados por componentes.
- **3D** é isolado em `src/components/3d` e comunica com a UI apenas através do estado.
- **Estado** global chega na Fase 3; até lá o único estado local é o acordeão de categorias.
- **Validação** vive num módulo próprio e é importada dinamicamente, para que Zod não
  entre no bundle inicial do cliente.

---

## Modelo de dados

Todos os produtos partilham `ComponentBase` e especializam-se por `category`, o que torna
`Component` um *union* discriminado:

```
ComponentBase            id · name · brand · category · model · price · weight
                         description · specifications · image?
  ├─ BikeFrame           material · sizes · maxTireWidth · bottomBracket ·
  │                      brakeSystem · frontAxle · rearAxle · seatpostDiameter
  ├─ Wheelset            material · rimDepth · wheelSize · freehub · axles ·
  │                      brakeSystem · tubelessReady
  ├─ Groupset            manufacturer · speeds · shifting · brakeSystem ·
  │                      freehub · bottomBracket
  ├─ Crankset            length · chainrings · ratio · bottomBracket · speeds
  ├─ Handlebar           type · width · material · clamp · reach · drop
  ├─ Saddle              railMaterial · width · seatpostDiameter
  ├─ Tire                width · type · tpi · wheelSize
  └─ Accessory           slot · quantity
```

**Unidades fixas no modelo**, para que nenhuma lógica tenha de adivinhar:

| Grandeza | Unidade |
| --- | --- |
| Preço | cêntimos de euro (inteiro) |
| Peso | gramas (inteiro; rodas contam como par) |
| Comprimentos, larguras, diâmetros | milímetros |

Cada produto guarda duas vistas dos seus dados: `specifications` (as linhas mostradas na
interface) e os atributos estruturados (os valores que as regras de compatibilidade vão
consumir). `tests/catalog.test.ts` garante que as duas não divergem.

Os esquemas Zod em `src/lib/validation/catalog-schema.ts` são o contrato de runtime do
catálogo. `validateCatalog()` é usado hoje pelos testes e será usado pela fronteira de API
quando existir backend. O catálogo embutido tem 31 produtos demonstrativos.

---

## Funcionalidades implementadas

**Fase 1 — base e interface**

- Landing page premium: hero `BUILD YOUR BIKE` + subtítulo e CTA pedidos, oito categorias,
  processo em três passos, secção de compatibilidade, fecho com CTA.
- Shell do configurador em `/configurator`: palco, controlos de câmara, oito categorias em
  acordeão acessível, painel de resumo e painel de estado do projeto.
- SEO: metadata, Open Graph, Twitter Card, `robots.txt`, `sitemap.xml`, `lang="pt-PT"`,
  *skip link*, landmarks, foco visível, 404.
- Responsivo: desktop, portátil, tablet e telemóvel (3D → componentes → resumo).

**Fase 2 — dados**

- Modelo de domínio completo em `src/types/components.ts`, com union discriminado por
  categoria.
- Catálogo demonstrativo de 31 produtos em `src/data/catalog`, dividido por categoria.
- Atributos técnicos necessários às regras de compatibilidade: standard de movimento
  pedaleiro, sistema de travagem, núcleo de cassete, eixos, diâmetro de espigão, largura
  máxima de pneus, número de velocidades, abraçadeira do guiador.
- Esquemas Zod para cada subtipo e para o catálogo completo, com mensagens de erro
  localizadas e caminho do campo inválido.
- Acessores puros e *type guards* em `src/lib/catalog.ts`.
- 29 testes: validação do catálogo, IDs únicos e *url-safe*, unidades inteiras, categorias
  coerentes, etiquetas obrigatórias por categoria, coerência entre atributos estruturados e
  linhas de especificação, e rejeição de payloads inválidos.

---

## Roadmap

| Fase | Conteúdo | Estado |
| --- | --- | --- |
| 1 | Arquitetura, configuração, UI inicial, SEO, README | ✅ concluída |
| 2 | Modelo de dados, catálogo, validação Zod, testes de integridade | ✅ concluída |
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

- **API e base de dados** — os acessores recebem o catálogo como argumento, por isso
  funcionam hoje com dados locais e amanhã com um payload remoto sem alteração de assinatura.
- **Autenticação e checkout** — nenhum endpoint ou credencial fictícios; contratos só
  quando existirem serviços reais.
- **Guardar e partilhar configurações** — a configuração será um objecto serializável e
  versionado, pronto para URL/localStorage/API.
- **Comparação, favoritos, recomendações, pesquisa e filtros** — seletores sobre o catálogo.
- **Modelos 3D realistas** — registry que associa IDs de produto a geometria procedural ou
  GLB carregado de forma lazy.
- **PDF, inventário, várias marcas, personalização de cor** — camadas de dados e de
  apresentação já desacopladas.

---

## Notas de engenharia

- **Unidades**: preço em cêntimos e peso em gramas, ambos inteiros. Evita erros de
  aritmética de ponto flutuante e força a formatação a acontecer só na camada de
  apresentação.
- **Zod fora do bundle do cliente**: o catálogo embutido é verificado em tempo de
  compilação com `satisfies`; a validação de runtime é importada dinamicamente e usada
  pelos testes e, no futuro, pela fronteira de API.
- **ESLint 9**: o plugin de React incluído no `eslint-config-next` 16 ainda chama
  `context.getFilename()`, que o ESLint 10 removeu. A versão está fixa na linha 9.x.
- **Build**: validado com `next build --webpack`. O Turbopack (padrão do Next 16) também é
  suportado pelo script `npm run build`.
- **TypeScript estrito**: `strict`, `noUncheckedIndexedAccess`, `noUnusedLocals`,
  `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`.

## Aviso

Marca, produtos, preços e pesos são **fictícios e ilustrativos**. Nenhum componente,
especificação técnica ou preço aqui apresentado corresponde a produto real. Antes de uso
comercial é necessário substituir o catálogo por dados técnicos verificados.

## Licença

Projeto de demonstração, sem licença definida.
