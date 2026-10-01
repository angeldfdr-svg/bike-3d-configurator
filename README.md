# Bike Configurator 3D

> **BUILD YOUR BIKE** — Cria a tua bicicleta. Escolhe cada componente. Constrói algo único.

Configurador web de bicicletas de gama alta: o utilizador escolhe quadro, rodas, grupo,
pedaleiro, guiador, selim, pneus e extras, e vê a bicicleta mudar em 3D enquanto o preço,
o peso, as especificações e a compatibilidade são recalculados em tempo real.

O projeto está a ser construído por fases, com verificação no fim de cada fase. Este
repositório contém a **Fase 5**: modelo de dados, catálogo, estado global, cena 3D
interativa com peças intercambiáveis e testes.

---

## Estado atual

| | |
| --- | --- |
| Fase | **5 de 11** — dados, estado, interface, cena 3D e peças intercambiáveis |
| Build | `next build --webpack` ✅ (5 rotas estáticas) |
| Typecheck | `tsc --noEmit` ✅ (TypeScript estrito) |
| Lint | `eslint .` ✅ (0 erros, 0 avisos) |
| Testes | `vitest run` ✅ (136 testes) |
| Smoke test | `npm run smoke` ✅ (25 verificações) |
| Cena 3D | `npm run verify:3d` ✅ (20 verificações em Chromium real) |

A bicicleta é visível e interativa em 3D, centrada e enquadrada em quatro vistas, com
rotação, zoom e rotação automática. **Cada categoria já lista os produtos reais do
catálogo e a escolha muda a peça desenhada**: um pedaleiro mono-prato perde o prato
interno, um grupo com travões de aro move os calibradores para o aro, um quadro de
titânio aparece em metal nu. Ainda **não** existem preço total, peso total nem motor de
compatibilidade: a interface mostra a estrutura final dessas áreas e identifica em que
fase cada uma entra — nada é simulado.

---

## Stack

| Tecnologia | Uso |
| --- | --- |
| **Next.js 16** (App Router) | Roteamento, rendering, metadata, `robots`/`sitemap` |
| **React 19** | Componentes de interface |
| **TypeScript 5.9** (estrito) | Tipos em todo o projeto, `noUncheckedIndexedAccess`, `noUnusedLocals` |
| **Tailwind CSS 4** | Design system em `src/app/globals.css` (`@theme`) |
| **Componentes UI** | Primitivas próprias ao estilo shadcn/ui (`Button`, `Badge`, `LinkButton`) |
| **Zod 4** | Contrato de validação do catálogo e das configurações |
| **Zustand 5** | Estado global do configurador (store vanilla testável) |
| **Three.js 0.186** | Motor WebGL da cena |
| **React Three Fiber 9** | Árvore de componentes React sobre Three.js |
| **Drei 10** | `OrbitControls` e utilitários de cena |
| **Vitest 3** | Testes de integridade do catálogo, geometria e regras de domínio |
| **Playwright** (dev) | Verificação da cena em Chromium real com WebGL |
| **Lucide** | Ícones |
| **Tipografia** | Manrope auto-alojada em `src/assets/fonts` (sem CDN em runtime) |

A animação da landing page usa CSS, pelo que Framer Motion não foi adicionado. Nenhuma
dependência foi incluída sem uso efectivo: Three.js só é descarregado quando o palco 3D
monta (ver *Notas de engenharia*).

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
npm run verify:3d  # verificação da cena em Chromium headless (WebGL por software)
```

`npm run verify:3d` precisa de build de produção prévio e descarrega o Chromium do
Playwright na primeira execução (`npx playwright install chromium`).

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
│  ├─ configurator/         # shell, palco, categorias, seleção de produtos, resumo
│  └─ 3d/                   # cena e peças procedurais
│     ├─ bike-model.tsx     # monta a bicicleta a partir das variantes
│     ├─ bike-scene.tsx     # Canvas, luzes e Suspense
│     ├─ camera-rig.tsx     # vistas predefinidas, rotação automática, OrbitControls
│     ├─ stage-canvas.tsx   # entrada pública: lazy, fallbacks, suporte WebGL
│     ├─ scene-boundary.tsx # error boundary da cena
│     ├─ webgl-support.ts   # deteção de WebGL sem hydration mismatch
│     ├─ geometry-cache.ts  # geometrias partilhadas (um buffer por forma)
│     ├─ material-cache.ts  # materiais partilhados (um programa por acabamento)
│     ├─ instanced-parts.tsx# peças repetidas numa só draw call
│     ├─ shadow.ts          # sombra de contacto gerada em canvas
│     ├─ tube.tsx           # cilindro entre dois pontos
│     └─ parts/             # quadro, rodas, grupo, pedaleiro, guiador, selim, extras
│        ├─ registry.ts     # categoria → componente que a desenha
│        └─ glb-models.ts   # ponto de extensão para modelos GLB
├─ config/                  # dados de estrutura: site, categorias, regras planeadas
├─ data/
│  └─ catalog/              # catálogo tipado por categoria + validação opcional
├─ lib/
│  ├─ catalog.ts            # acessores puros sobre o catálogo + seleção de configuração
│  ├─ configuration.ts      # helpers puros de configuração
│  ├─ format.ts             # formatação de preço, peso e comprimento (pt-PT)
│  ├─ 3d/
│  │  ├─ bike-geometry.ts   # geometria procedural em metros (pura, sem Three.js)
│  │  ├─ camera-views.ts    # enquadramento das vistas predefinidas (puro)
│  │  ├─ part-variants.ts   # variante visual de cada produto (pura)
│  │  ├─ instances.ts       # colocação de peças repetidas (puro)
│  │  └─ material-palette.ts# paleta de materiais como dados
│  ├─ validation/           # schemas Zod (contrato de runtime)
│  └─ utils.ts, site-url.ts
├─ store/
│  ├─ bike-store.ts         # store Zustand + hook de subscrição
│  └─ repositories.ts       # persistência (localStorage / memória / API)
├─ services/                # (futuro) persistência e API
└─ types/
   └─ components.ts         # modelo de domínio
tests/
├─ catalog.test.ts          # integridade do catálogo e da validação
├─ configuration.test.ts    # helpers e serialização de configuração
├─ bike-store.test.ts       # store, persistência e invariantes
├─ 3d-geometry.test.ts      # geometria da bicicleta e enquadramento das vistas
├─ 3d-parts.test.ts         # variantes visuais, instâncias e registry
└─ format.test.ts           # formatação de preço, peso e comprimento
public/images/              # assets editoriais
docs/                       # roadmap técnico
scripts/                    # smoke test sem dependências
```

### Limites de responsabilidade

- **UI** nunca contém regras de negócio: preço, peso e compatibilidade viverão em
  `src/lib` como funções puras, testáveis sem React.
- **Dados** de produto são objetos tipados em `src/data`, nunca espalhados por componentes.
- **3D** é isolado em `src/components/3d` e comunica com a UI apenas através do estado: a
  cena lê a configuração do store e nunca escreve nela.
- **Geometria 3D** vive em `src/lib/3d` como funções puras, sem Three.js. A cena desenha o
  que essa função devolve, por isso a forma da bicicleta é testável sem renderer.
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

**Fase 5 — peças intercambiáveis**

- Cada categoria do configurador lista os **31 produtos reais** do catálogo, com nome,
  modelo, atributos técnicos, preço e peso. A escolha escreve diretamente no store.
- **Variantes visuais derivadas dos atributos**, em `src/lib/3d/part-variants.ts`:
  quadro *aero* de carbono com tubos achatados e cablagem interna versus quadro *gravel*
  de titânio com tubos redondos e metal nu; aro carbono de 45 mm com 20 raios versus aro
  de alumínio com 28 e pista de travão maquinada; pneu *slick* de 320 tpi versus pneu
  *gravel* com blocos; pedaleiro duplo versus mono-prato; grupo mecânico com cabos
  versus eletrónico com bateria; travões de disco com rotores versus travões de aro com
  calibradores no aro; cassete com um carreto por velocidade e corpo XDR mais estreito;
  guiador *gravel* com *flare*; selim de corrida de nariz curto versus selim de
  endurance; e extras montáveis (computador, luzes, bidões, bolsa).
- **Registry** (`src/components/3d/parts/registry.ts`): um único ficheiro mapeia categoria
  → componente que a desenha, e `glb-models.ts` é o ponto de extensão tipado para modelos
  GLB. Nenhum produto declara modelo ainda, por isso não existe loader sem uso — um teste
  garante essa invariante.
- **Otimização medida**: 55 a 64 *draw calls*, 12 000 a 16 000 triângulos, **18 a 25
  geometrias distintas** e **3 programas de shader** para a bicicleta completa. Raios e
  blocos de pneu são instanciados, e todas as formas repetidas partilham um buffer.
- Seleção de tamanho de quadro e quantidade de extras integradas no store.

**Fase 4 — cena 3D**

- `Canvas` do React Three Fiber carregado de forma lazy (`next/dynamic` com `ssr: false`),
  dentro de `Suspense` e de um error boundary próprio.
- Bicicleta **procedural e centrada**: quadro, roda dianteira e traseira com aro, raios,
  pneu e cubo, cassete, desviador, corrente, travões, pedaleiro, pratos, pedais, guiador
  com drops e manetes, e selim com carris.
- Geometria derivada da configuração em metros (`src/lib/3d/bike-geometry.ts`): tamanho do
  quadro, dimensão da roda, largura do pneu limitada pelo quadro, comprimento da pedaleira,
  largura do guiador e relação de pratos. Trocar uma peça muda a silhueta.
- Quatro vistas predefinidas (frontal, lateral, traseira e superior) ligadas ao estado
  `camera.view` do store, com transição animada até ao enquadramento.
- Rotação, zoom e rotação automática através de `OrbitControls`, com um único caminho de
  código a escrever a câmara para que os três modos nunca se sobressaiam.
- Degradação em três camadas: sem WebGL → fotografia de referência; exceção na cena → o
  mesmo fallback; a carregar → indicador. A deteção de WebGL usa `useSyncExternalStore`
  para não introduzir *hydration mismatch*.
- A landing page mantém-se leve: o Three.js não entra no bundle inicial de `/`.
- Verificação real em Chromium headless com WebGL por software (`npm run verify:3d`):
  contexto vivo, pixels desenhados, vistas, rotação, arrasto, viewport móvel, troca de
  quadro a alterar a cena, pedaleiro mono-prato, grupo com travões de aro, extra montado
  e `aria-pressed` na seleção — 20 verificações.

**Fase 3 — estado**

- Store Zustand (`src/store/bike-store.ts`) criado por uma fábrica que recebe o
  repositório e o catálogo, por isso é testável sem DOM e sem `localStorage`.
- Estado: configuração (ids, tamanho do quadro, extras com quantidade), estado de
  carregamento, erro, câmara (vista predefinida e rotação automática) e
  configuração guardada.
- Ações tipadas para cada categoria, tamanho do quadro, extras, câmara, reset,
  hidratação, guardar, restaurar e limpar.
- Configurações inválidas (id desconhecido) são ignoradas em silêncio no store, e
  payloads corrompidos são rejeitados pelo Zod antes de chegarem ao estado.
- Persistência atrás da interface `ConfigurationRepository`: `localStorage` no
  browser, memória em SSR/testes, API no futuro — sem alterar o store.
- O store guarda ids, nunca produtos: a configuração é pequena, serializável para
  URL ou base de dados, e continua válida quando o catálogo muda.
- 136 testes no total (catálogo, helpers de configuração, serialização, store, geometria
  3D, variantes visuais, instâncias e formatação).

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
| 3 | Zustand: seleção, configuração, loading, câmara, persistência | ✅ concluída |
| 4 | Cena 3D (React Three Fiber, Drei, Suspense, fallback de WebGL, vistas de câmara) | ✅ concluída |
| 5 | Peças 3D intercambiáveis + registry para GLB/GLTF lazy | ✅ concluída |
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
- **Zod fora do bundle inicial do cliente**: o catálogo embutido é verificado em tempo de
  compilação com `satisfies`; a validação de runtime é importada dinamicamente (ficou
  confirmado que o chunk do Zod não é carregado no primeiro paint).
- **Store vanilla**: o estado é criado por `createStore` e exposto a React através de
  `useStore` com seletores, o que permite testar todo o comportamento sem renderizar
  componentes.
- **Three.js fora do bundle inicial**: a cena é um `dynamic(..., { ssr: false })`, por isso
  `/` e o primeiro paint de `/configurator` não carregam os ~700 KB do motor 3D. Confirmado
  comparando os chunks referenciados no HTML de cada rota.
- **Geometria sem renderer**: `src/lib/3d/bike-geometry.ts` não importa Three.js. A
  conversão de mm para metros acontece uma única vez, nesse limite, e as invariantes
  (altura do selim, drop do guiador, altura da coroa do garfo, enquadramento) são testadas
  em `tests/3d-geometry.test.ts`.
- **Uma só escrita na câmara**: `CameraRig` resolve vistas, rotação automática e controle
  do utilizador no mesmo `useFrame`, evitando o clássico conflito entre `OrbitControls` e
  posições definidas por código.
- **Sombra por textura**: o chão usa uma elipse gerada em canvas em vez de *shadow maps*,
  o que mantém a cena barata em dispositivos sem GPU dedicada.
- **Geometria e material partilhados**: `geometry-cache.ts` e `material-cache.ts` guardam
  um buffer por forma e um material por acabamento. A bicicleta completa usa 18 a 25
  geometrias e 3 programas de shader, contra ~60 geometrias se cada malha criasse a sua.
- **Instâncias para o que repete**: raios e blocos de pneu são `InstancedMesh`, pelo que
  uma roda com 28 raios continua a custar uma *draw call*.
- **Variantes como dados**: `src/lib/3d/part-variants.ts` decide *o que* desenhar a partir
  dos atributos do produto, sem React e sem Three.js. As regras visuais são testáveis e a
  Fase 7 pode reutilizar os mesmos atributos para as regras de compatibilidade.
- **Medição de performance**: os números de *draw calls*, triângulos, geometrias e
  programas foram lidos de `renderer.info` numa sessão de perfis temporária. O FPS em
  Chromium headless com WebGL por software não é representativo de GPU real e não é
  usado como métrica.
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
