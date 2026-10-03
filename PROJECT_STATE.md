# PROJECT_STATE

Estado vivo do projeto. Actualizado no fim de cada fase; a fonte de verdade para
"o que está feito, o que falta e o que decidir a seguir".

- **Fase actual:** 8 de 11 — concluída e verificada
- **Branch:** `main` (repositório local, sem remoto configurado)
- **Última verificação completa:** typecheck, lint, testes, build, smoke, verificação
  da cena 3D em Chromium real e auditoria de responsividade em quatro viewports —
  todos verdes

---

## 1. O que o projeto é

**Bike Configurator 3D** — configurador premium de bicicletas em 3D. O utilizador
escolhe componentes (quadro, rodas, grupo, pedaleiro, guiador, selim, pneus, extras)
e vê preço total, peso total, especificações, compatibilidade e resumo actualizados
em tempo real, sobre uma bicicleta 3D interactiva.

Construção por fases (1–11), com paragem e verificação no fim de cada fase.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript estrito · Tailwind CSS 4 ·
Zustand 5 · Zod 4 · Three.js 0.186 · React Three Fiber 9 · Drei 10 · Vitest 3 ·
Playwright (verificação) · Lucide · Manrope auto-alojada.

**Decisões de produto fixas:** interface em português de Portugal; nada é simulado — o
que ainda não existe aparece identificado como fase futura.

**Requisito novo do utilizador (2026-10-02), a cumprir quando for conveniente:**
*tudo o que estiver no site deve ser real e ter quase todos os produtos que existem no
mercado; pode implementar-se qualquer ferramenta necessária para isso.* Isto substitui a
decisão anterior de produtos ilustrativos. Ver «Objectivo: catálogo real» abaixo.

---

## 2. Fases

| Fase | Conteúdo | Estado |
| --- | --- | --- |
| 1 | Arquitectura, configuração, landing page, shell do configurador, SEO | ✅ concluída |
| 2 | Modelo de dados, catálogo (31 produtos), validação Zod, testes | ✅ concluída |
| 3 | Zustand: selecção, configuração, câmara, persistência | ✅ concluída |
| 4 | Cena 3D (R3F, Drei, Suspense, fallback WebGL, vistas de câmara) | ✅ concluída |
| 5 | Peças 3D intercambiáveis + registry para GLB/GLTF lazy | ✅ concluída |
| 6 | Preço e peso em tempo real (funções puras + testes) | ✅ concluída |
| 7 | Motor de compatibilidade modular (regras, severidade, mensagens) | ✅ concluída |
| 8 | Responsividade do configurador (desktop split, mobile empilhado) | ✅ concluída |
| 9 | Microanimações, transições, estados vazios/erro/carregamento | pendente |
| 10 | Testes de domínio e interface, performance 3D | pendente |
| 11 | Limpeza, revisão final, preparação para deploy | pendente |

---

## 3. Fase 8 — o que foi feito

### 3.1 Ordem de leitura em qualquer largura

O roadmap vivia dentro da coluna esquerda, pelo que nos layouts empilhados se metia
entre o palco 3D e os componentes que o visitador ali vai escolher. Passou a ser um
bloco próprio (`order-3 lg:col-span-2`), o que dá a ordem **3D → componentes → resumo
→ roadmap** nos quatro viewports verificados. O roadmap é informação de progresso, não
parte de montar uma bicicleta, por isso fica no fim.

### 3.2 Palco e controlos dimensionados para toque

- O palco passa a `aspect-[4/3] sm:aspect-[16/10]`: no telemóvel o canvas ganha altura
  (348×261 em vez de 348×218) sem que a bicicleta encolha.
- Os botões de vista e de rotação passam a `min-h-11` (44 px), e o grupo de vistas é
  largo no telemóvel (`w-full sm:ml-auto sm:w-auto`) para não ficar apertado contra a
  etiqueta.
- O link «voltar» do cabeçalho do configurador era 36×36, e o flex comprimia-o para
  28×44 no telemóvel; passou a `size-11 shrink-0`.

A nota de instruções do palco passou a descrever o gesto de toque, não o do rato.

### 3.3 O enquadramento segue o aspecto real do canvas

O enquadramento era calculado contra um 16:10 fixo, enquanto o palco é um elemento
responsável. `camera-views.ts` passou a exportar `DESIGNED_STAGE_ASPECT` e
`stageAspect(width, height)`, e `fitDistance`, `framingFits` e `resolveCameraPreset`
recebem o aspecto como argumento. O `camera-rig.tsx` lê `useThree(s => s.size)` e passa
o aspecto medido, pelo que um canvas 4:3 ou 16:10 é enquadrado para a caixa em que
realmente está.

### 3.4 Defeito pré-existente encontrado e corrigido: a transição de vista parava a meio

**Achado da fase.** Com o enquadramento dependente do aspecto, a medição por píxeis
mostrou a bicicleta deslocada para cima e cortada no topo no desktop. A causa não era
o `aspect`: era a transição de vista.

`animating.current` passava a falso assim que a **posição** da câmara chegava ao
destino. O **alvo** do `OrbitControls` continuava onde a cena o tinha deixado (Y = 0,094
em vez de 0,477), e a câmara aponta para o alvo dos controlos. Na vista lateral — a
vista por omissão, em que a câmara já começa no destino — a transição terminava no
primeiro frame e o enquadramento ficava errado até ao clique seguinte.

A condição passou a exigir que os dois cheguem, extraída para a função pura
`presetSettled(cameraDistance, targetDistance)` em `camera-views.ts`, com três testes.
Depois da correcção, a medição por píxeel dá a bicicleta inteira e centrada nos quatro
viewports, com margens de 30 a 79 px.

### 3.5 Como o enquadramento foi medido

Duas armadilhas de medição, registadas para não se repetirem:

1. **As marcas de mira do DOM são verde-lima** e ficam a 16 px das bordas do canvas.
   Medir «verde» no canvas apanha-as e devolve sempre um *bounding box* de margens
   iguais, independentemente do enquadramento.
2. **`page.screenshot({ clip })` usa coordenadas da página** enquanto `boundingBox()` é
   relativo ao *viewport*; clicar nos botões de vista revolve a página nos layouts
   empilhados e a região capturada deixa de ser o canvas.

A medição fiável é a cor das paredes dos pneus (castanho/tijolo), que nenhuma
sobreposição usa.

## 4. Fase 7 — o que foi feito

### 4.1 Nove regras (`src/lib/compatibility.ts`)

| Regra | O que compara | Severidade |
| --- | --- | --- |
| `movimento-pedaleiro` | `frame.bottomBracket` vs `groupset.bottomBracket` e `crankset.bottomBracket` | erro |
| `nucleo-cassete` | `wheelset.freehub` vs `groupset.freehub` | erro |
| `travagem` | família de travão do quadro e das rodas vs a do grupo | erro |
| `largura-pneu` | `tire.width` vs `frame.maxTireWidth` | erro |
| `tamanho-roda` | `wheelset.wheelSize` vs `tire.wheelSize` | erro |
| `velocidades` | `groupset.speeds` vs `crankset.speeds` | erro |
| `espigao-selim` | `frame.seatpostDiameter` vs `saddle.seatpostDiameter` | erro |
| `eixos` | eixos do quadro vs das rodas, à frente e atrás | erro |
| `tubeless` | pneu tubeless em aro não preparado | aviso |

Duas severidades, e a diferença é deliberada: `erro` impede a bicicleta de ser montada;
`aviso` é permitido mas dito em voz alta. Um pneu tubeless num aro que não é tubeless
ready monta-se com câmara interna, e bloquear isso seria falso.

As famílias de travão são normalizadas: `disco-hidraulico` e `disco-mecanico` partilham a
fixação, por isso são a mesma família. Um grupo hidráulico num quadro de disco mecânico
funciona.

### 4.2 Cada conflito traz a razão e a saída

A mensagem usa os valores reais dos dois produtos e nomeia as alternativas que existem no
catálogo:

> Diâmetro de espigão incompatível
> O quadro Ti Gravel é de espigão 31,6 mm e o selim Race 143 é de carris 27,2 mm.
> Escolhe um selim de carris 31,6 mm — Gravel 145.

As medidas passam por `formatLength`, para que uma mensagem em português nunca mostre
`31.6 mm`.

### 4.3 Assinalado antes de escolher

`conflictsWithBuild` corre as regras sobre uma **configuração candidata**, em vez de
comparar relatórios. Por isso o selector e o resumo não podem discordar sobre o que é
compatível: ambos leem a mesma função.

### 4.4 O aviso vive fora do botão

**Defeito encontrado e corrigido durante a fase.** O aviso de conflito estava dentro do
`<button>` do produto, pelo que o nome acessível do botão «Race 143» ficava a conter
«Gravel 145» — o texto da resolução desse produto. A verificação em browser apanhou-o:
um selector por nome acessível clicava no botão errado. Passou a estar fora do botão,
ligado por `aria-describedby`. Um utilizador de leitor de ecrã continua a ouvir a razão,
mas o nome do botão continua a ser só o nome do produto.

### 4.5 Resumo

`summary-panel.tsx` passou a mostrar o estado de compatibilidade com todos os erros e
avisos, e as especificações em destaque (quadro, grupo, rodas, pneus, tamanho). O badge do
cabeçalho passou a ser `Compatível` / `Incompatível`.

## 5. Fase 6 — o que foi feito

### 5.1 Motor de preço e peso (`src/lib/pricing.ts`)

`costBuild(source, configuration)` devolve uma linha por categoria escolhida, uma linha
por extra montado e os dois totais. As decisões que o motor toma explicitamente:

| Decisão | Valor | Justificação |
| --- | --- | --- |
| Unidade de preço | cêntimos inteiros | o catálogo já guarda cêntimos; somar inteiros não pode perder precisão |
| Unidade de peso | gramas inteiras | idem, em gramas |
| Arredondamento | nenhum | toda a soma é exacta; se um catálogo passar a ter fracções, a política decide-se aqui uma vez |
| Rodas | 1 unidade | o catálogo diz «Peso do par» na própria ficha do produto |
| Pneus | 2 unidades | um produto é a borracha de uma roda; a ficha diz apenas «Peso» |
| Restantes categorias | 1 unidade | uma bicicleta tem um quadro, um grupo, um pedaleiro, um guiador e um selim |
| Extras | a quantidade escolhida | 1 ou 2, limitado pelo picker e clampado no motor |
| Categoria em falta | listada em `missing` | um build incompleto diz qual é o componente que falta |
| Id desconhecido | tratado como em falta | não é silenciosamente gratuito |

A garantia de que nada é contado duas vezes é estrutural: as sete categorias são
percorridas uma vez cada e os extras uma vez cada. O grupo leva a cassete, os
desviadores e os travões no seu preço e o par de rodas leva os cubos e os raios; nenhum
deles tem categoria própria, pelo que não existe segunda linha que os possa duplicar.
Um teste compara a soma das linhas com o total.

### 5.2 Painel de resumo

`summary-panel.tsx` passou a ser cliente e a chamar o motor. Mostra o preço e o peso
totais; quando o build está incompleto mostra o total parcial com cor esbatida, a
etiqueta «Incompleto» e a lista dos componentes que faltam. «Especificações» e
«Compatibilidade» continuam por preencher — são a Fase 7.

### 5.3 Valor de referência

Build completo usado na verificação em browser, conferido linha a linha contra o
catálogo:

```
Quadro    Ti Gravel      215000 c  1480 g
Rodas     Alloy 24        69000 c  1810 g
Grupo     Di2 12         329000 c  2480 g
Pedaleiro DUB 172,5       35900 c   760 g
Guiador   Gravel 44       11900 c   340 g
Selim     Endurance 148    7900 c   230 g
Pneus     Gravel 40 (x2)  16800 c   760 g
Extras    Cycle Computer  24900 c    85 g
                                  ---------
TOTAL                     710400 c  7945 g  ->  7104,00 € · 7,9 kg
```

O browser mostrou exactamente estes dois valores.

---

## 6. Fase 5 — o que foi feito

### 6.1 Variantes visuais (`src/lib/3d/part-variants.ts`)

Funções puras que traduzem os atributos do catálogo no que a cena desenha:

| Categoria | O que muda |
| --- | --- |
| Quadro | perfil *aero* (tubos achatados, cablagem interna) vs *round* (gravel); pintura por material: carbono pintado, titânio e alumínio em metal nu |
| Rodas | aro carbono vs alumínio, pista de travão maquinada, 20/24/28 raios, largura do cubo |
| Pneus | piso liso (320 tpi), todo-o-tempo (44 blocos) ou gravel (26 blocos maiores); bead escondido em tubular |
| Pedaleiro | 1 ou 2 pratos, rácio interno, material do eixo por standard de movimento |
| Grupo | mecânico (cabos) vs eletrónico (bateria); disco (rotores) vs aro (calibradores no aro); carretos por velocidade; corpo XDR mais estreito |
| Guiador | *flare* em barras *gravel*, raio de *drop* e alcance reais, material |
| Selim | corrida (nariz curto) vs endurance, largura da casca, material dos carris |
| Extras | computador, luzes, bidões e bolsa, limitados pela capacidade de cada encaixe |

### 6.2 Colocação de instâncias (`src/lib/3d/instances.ts`)

Tuplas puras para peças repetidas: anéis, raios radiais, carretos de cassete e montagens
em tubos. A cena converte-as em matrizes de instância, pelo que uma roda com 28 raios
custa uma *draw call*.

### 6.3 Caches (`geometry-cache.ts`, `material-cache.ts`)

Um buffer por forma e um material por acabamento. `<primitive>` nunca é descartado pelo
R3F (confirmado no código-fonte do reconciler), por isso o cache é seguro.

### 6.4 Registry

`parts/registry.ts` mapeia categoria → componente. `parts/glb-models.ts` é o ponto de
extensão tipado para GLB: está vazio de propósito, e um teste garante que assim continua,
para não existir um *loader* sem uso.

### 6.5 Seleção de produtos

`category-panel.tsx` passou a listar os produtos reais com `product-picker.tsx`, ligado
às ações do store já testadas na Fase 3. Inclui seleção de tamanho de quadro e
quantidade de extras. Preço e peso por produto são factos do catálogo.

### 6.6 Seleção no catálogo

`findSelection(source, configuration)` em `src/lib/catalog.ts` resolve os ids da
configuração em produtos tipados. A Fase 6 reutilizou-a directamente.

---

## 7. Fase 4 — o que foi feito

### 7.1 Geometria procedural (`src/lib/3d/bike-geometry.ts`)

Funções puras, sem Three.js. Recebem a configuração e o catálogo e devolvem todas as
âncoras em metros:

- `wheelRadius` a partir do aro (700c/650b) e da largura do pneu;
- `wheelbase`, eixos traseiro/dianteiro, caixa do pedaleiro (com *drop* e *offset*);
- `seatCluster` e `headTubeTop`/`headTubeBottom` por trigonometria (73,5° no tubo de
  selim, 73° na direcção);
- `handlebarCenter`, `saddleCenter`, `crankLength`, `chainringRadius`, `handlebarWidth`,
  `tireWidth`, `rimDepth`;
- `bikeHeight`, `bikeCenter`, `frameAnchors`.

A largura do pneu é limitada pela `maxTireWidth` do quadro escolhido — uma regra real,
exercitada por teste.

**Bug corrigido durante a fase:** o garfo foi inicialmente derivado do ângulo da
direcção, o que punha a coroa do garfo a 49 cm do chão (deveria ser ~71 cm). O garfo é
quase vertical; o ângulo da direcção pertence ao eixo da direcção. Passou a existir
`FORK_LENGTH` (0,373 m) com `FORK_RAKE_ANGLE` (7°).

### 7.2 Enquadramento (`src/lib/3d/camera-views.ts`)

`resolveCameraPreset(view, geometry)` devolve posição e alvo para as quatro vistas,
com a distância calculada a partir da FOV vertical (35°), do *aspect* do palco (16:10)
e da extensão relevante da bicicleta em cada vista (comprimento de lado, largura do
guiador de frente). `framingFits(view, geometry)` é a invariante testada: a bicicleta
nunca é cortada.

A vista superior é inclinada (52° de elevação, 30° de azimute) porque olhar exactamente
de cima deixa o vetor *up* paralelo à direcção da vista, o que é indefinido.

### 7.3 Cena (`src/components/3d/`)

| Ficheiro | Papel |
| --- | --- |
| `stage-canvas.tsx` | entrada pública; lazy, fallbacks, deteção de WebGL, descrição acessível |
| `bike-scene.tsx` | `Canvas`, luzes, `Suspense`, câmara inicial |
| `bike-model.tsx` | monta as peças a partir das variantes + sombra em canvas |
| `camera-rig.tsx` | vistas, rotação automática e `OrbitControls` num único `useFrame` |
| `scene-boundary.tsx` | error boundary da cena |
| `webgl-support.ts` | deteção via `useSyncExternalStore` (sem *hydration mismatch*) |
| `geometry-cache.ts` / `material-cache.ts` | buffers e materiais partilhados |
| `instanced-parts.tsx` | peças repetidas numa só *draw call* |
| `shadow.ts` | sombra de contacto gerada em canvas |
| `tube.tsx` | cilindro entre dois pontos |
| `parts/registry.ts` | categoria → componente que a desenha |
| `parts/glb-models.ts` | ponto de extensão tipado para modelos GLB |

A cena lê `configuration` e `camera` do store e nunca escreve no store.

### 7.4 Interface

- `stage-panel.tsx` passou a alojar o canvas real (mira, badges, título, nota honesta).
- `camera-controls.tsx` ligado ao store: as quatro vistas e o botão `Rodar` funcionam.

---

## 8. Verificações

| Verificação | Resultado |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 erros |
| `npx eslint .` | ✅ 0 erros, 0 avisos |
| `npx vitest run` | ✅ **194 testes** (29 catálogo + 20 configuração + 23 store + 26 geometria + 35 peças + 16 preço/peso + 39 compatibilidade + 6 formatação) |
| `npx next build --webpack` | ✅ 5 rotas estáticas |
| `npm run smoke` | ✅ 25 verificações |
| `npm run verify:3d` | ✅ 30 verificações em Chromium real |
| Auditoria de responsividade (4 viewports) | ✅ overflow 0 px, ordem 3D → componentes → resumo → roadmap, alvos de toque ≥ 44 px, bicicleta inteira no canvas |

`verify:3d` (`scripts/verify-3d.mjs`) arranca o servidor de produção, abre
`/configurator` em Chromium headless com WebGL por software (SwiftShader) e verifica:
contexto WebGL vivo, *drawing buffer* alocado, pixels desenhados, vistas predefinidas
(`aria-pressed`), mudança de enquadramento entre vistas, rotação automática ligada e
desligada, arrasto com o ponteiro, **seleção de quadro a alterar a cena**, pedaleiro
mono-prato, grupo com travões de aro, extra montado, `aria-pressed` no produto
selecionado, **build vazio sem preço**, **resumo com preço e peso reais**, **build
completo sem componentes em falta**, **total a mover-se ao trocar um componente**,
viewport móvel e ausência de erros de consola. As capturas ficam em `.verify/`.

### 8.1 Performance medida

Lido de `renderer.info` numa sessão de perfis temporária (sonda removida depois):

| Configuração | Draw calls | Triângulos | Geometrias | Programas |
| --- | --- | --- | --- | --- |
| Vazia (valores de recurso) | 55 | 12 358 | 18 | 3 |
| Pneu gravel 40 mm | 61 | 13 814 | 22 | 3 |
| Rodas alloy 24 mm | 63 | 15 926 | 24 | 3 |
| Gravel + mono + aro + extra | 64 | 15 030 | 25 | 3 |

Os números confirmam os caches: 25 geometrias e 3 programas para uma bicicleta com 64
*draw calls*. O FPS em Chromium headless com WebGL por software **não** é usado como
métrica: a mesma cena deu 12 fps e 60 fps em corridas diferentes, por isso não é
representativo de GPU real.

### 8.2 Bundle

- `/` carrega 599 KB em 8 chunks; `/configurator` carrega 606 KB em 9 chunks.
- Os ~700 KB do Three.js **não** estão em nenhum dos dois: entram apenas quando o palco
  3D monta, por causa do `dynamic(..., { ssr: false })`.
- O chunk do Zod continua diferido e fora do primeiro paint.

---

## 9. Decisões registadas

1. **Geometria procedural primeiro, GLB depois.** Nenhum asset 3D foi descarregado da
   internet: a bicicleta é construída por código. Isto mantém o repositório leve, evita
   problemas de licença e dá pontos de âncora estáveis para as peças intercambiáveis.
2. **Três camadas de degradação.** Sem WebGL, com excepção na cena, ou a carregar — o
   palco nunca fica vazio e a configuração continua utilizável.
3. **`useSyncExternalStore` para detectar WebGL.** Um `useEffect` com `setState` violava
   a regra `react-hooks/set-state-in-effect` e arriscava *hydration mismatch*.
4. **Uma só escrita na câmara.** Vistas, rotação automática e controle do utilizador
   partilham o mesmo `useFrame`; o arrasto do utilizador cancela a animação de vista.
5. **Sombra por textura, não *shadow maps*.** Um canvas com elipse é mais barato e não
   depende de `shadows` no renderer.
6. **Playwright como dependência de desenvolvimento.** É a única forma de verificar a
   cena 3D neste ambiente (sem GPU). Não entra no bundle de produção.
7. **Unidades.** Metros só dentro de `src/lib/3d`; os produtos continuam em mm no
   catálogo. A conversão acontece uma única vez.
8. **Variantes em dados, não em JSX.** O que a cena desenha é decidido por funções puras
   sobre os atributos do produto, para que as regras visuais sejam testáveis e a Fase 7
   reutilize os mesmos atributos nas regras de compatibilidade.
9. **Sem loader de GLB sem uso.** O ponto de extensão existe e está tipado, mas nenhum
   produto declara modelo; um teste garante que não há código morto a caminho.
10. **Preço, peso e compatibilidade no motor, nunca no componente.** O componente escolhe
    a forma de apresentar; quem calcula são `src/lib/pricing.ts` e
    `src/lib/compatibility.ts`. Formatar é `src/lib/format.ts`.
11. **Quantidades como dados.** Quantas unidades uma bicicleta precisa é uma decisão de
    produto declarada em `slotQuantities`, não um `* 2` enterrado num componente.
12. **Conflito é assinalado antes de ser escolhido.** As regras correm sobre uma
    configuração candidata, para que o selector e o resumo nunca possam discordar.
13. **O aviso de conflito vive fora do botão.** Metê-lo dentro dobraria o nome de outro
    produto no nome acessível deste botão; `aria-describedby` liga os dois sem os misturar.
14. **Build incompleto é declarado, não escondido.** Um preço parcial aparece sempre
    acompanhado da lista do que falta, para que nunca seja confundido com o preço de uma
    bicicleta.
15. **O enquadramento recebe o aspecto, não assume um.** A distância da câmara é
    calculada para a caixa em que o canvas realmente está; `stageAspect` é a fronteira
    que traduz um tamanho medido no rácio que a matemática precisa, com recurso ao
    aspecto de desenho quando a medição é degenerada.
16. **Uma transição de vista acaba quando os dois chegam.** Posição da câmara e alvo
    do `OrbitControls` são coisas distintas, e a câmara aponta para o segundo. Parar
    só na primeira deixava o enquadramento errado até ao clique seguinte; a condição
    vive numa função pura testada, fora do `useFrame`.
17. **Roadmap no fim da leitura.** Informação de progresso não é parte de montar uma
    bicicleta, por isso fica depois do resumo em vez de entre o palco e os componentes.

---

## 10. Problemas conhecidos

- **Turbopack inviável neste sandbox** (2 vCPU / 2 GB RAM): os builds excedem 600 s.
  Usar `npx next build --webpack`. O script `npm run build` mantém o Turbopack.
- **`.git/config` não persiste** no snapshot do workspace: ao reiniciar o ambiente é
  preciso repetir `git config user.name` / `user.email`.
- **Sem remoto GitHub**: `git push` requer repositório e credenciais do utilizador.
- **As peças são blocos com perfil**, não modelos fiéis: o aro é um toro, o selim uma
  esfera escalada. A Fase 5 já diferenciou materiais, contagens e formas; modelos GLB
  reais substituiriam as formas quando existirem assets.
- **`frameloop` está em `always`**, porque a rotação automática precisa de frames
  contínuos. Se a performance em telemóvel for fraca, a Fase 10 deve passar para
  `demand` + `invalidate()`.
- **O selim continua a ser uma esfera escalada** com um nariz, o mais fraco do modelo.
- **A planta da bicicleta é fixa**: todas as molduras partilham a mesma distância entre
  eixos e os mesmos ângulos de tubo. Um quadro *gravel* deveria ter mais alcance e mais
  folga; a Fase 7 ou 8 pode introduzir geometria por tipo de quadro.
- **O navegador headless usa WebGL por software**: as capturas são representativas da
  geometria, não da performance em GPU real.
- **O espigão do selim não tem categoria própria**, pelo que o seu peso não entra no
  total. O catálogo tem o diâmetro em vários produtos, mas não o produto em si.
- **Nenhuma roda do catálogo é de aro**, por isso a regra de travagem de aro só dispara
  contra o quadro e o grupo. Quando chegarem produtos reais, a regra já cobre o caso.
- **A potência (avanço) não é categoria**, pelo que a regra «guiador compatível com a
  potência» que o roadmap documentou não pode ser implementada ainda.

---

## 11. Próximo passo — Fase 9

Microanimações, transições e estados:

1. Transições de vista mais polidas, com respeito por `prefers-reduced-motion`.
2. Estados vazios, de carregamento e de erro em cada painel.
3. Confirmação visual ao montar um extra e ao mudar de tamanho de quadro.
4. Revisão do `frameloop`: passar para `demand` + `invalidate()` se a Fase 10 medir
   consumo excessivo em telemóvel.

**Critério de saída:** typecheck, lint, testes, build, smoke e `verify:3d` verdes, com
as animações desligáveis e nenhum painel a poder ficar vazio sem explicação.

---

## 12. Objectivo: catálogo real

Pedido explícito do utilizador: **tudo o que estiver no site deve ser real e cobrir
quase todos os produtos que existem no mercado**, com liberdade para implementar
qualquer ferramenta necessária. Enquanto não chegar, o catálogo actual é ilustrativo e
está identificado como tal — nada é apresentado como real sem o ser.

O que muda quando o catálogo real entrar:

| Área | O que precisa de acontecer |
| --- | --- |
| Volume | 31 produtos passam a centenas ou milhares. A listagem tem de ser paginada, pesquisável e filtrável, não uma lista infinita. |
| Fonte | Os dados deixam de ser ficheiros `.ts` e passam a vir de uma API e de uma base de dados. `src/lib/catalog.ts` já toma a fonte como argumento, por isso a transição é trocar a origem, não reescrever os consumidores. |
| Validação | O schema Zod já existe em `src/lib/validation/catalog-schema.ts`; passa a validar o payload da API em vez de os ficheiros locais. |
| Precisão | Preço e peso reais vêm com data de atualização e fonte. O motor de preço tem de continuar a somar inteiros nas unidades declaradas. |
| Compatibilidade | As nove regras actuais leem atributos estruturados; produtos reais trazem variações (vários tamanhos de quadro, vários acabamentos) que as regras têm de respeitar. |
| Imagens | `ComponentBase.image` já existe e a interface já desenha um substituto. Faltam os assets reais. |
| Marca | `VELOCE` é fictícia. Com produtos reais, a marca da loja e a marca dos produtos são coisas distintas. |

Ferramentas que o objectivo provavelmente vai exigir, e que não existem ainda:
ingestão/ETL de catálogo, normalização de atributos entre fabricantes, cache e
paginação, e painel de administração. Nada disto deve ser inventado antes de ser
preciso.

## 13. Comandos úteis

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção (Turbopack)
npx next build --webpack   # build usado nas verificações
npm start            # servidor de produção (porta 3000)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint .
npm test             # vitest run
npm run smoke        # verificações de rota/SEO/assets
npm run verify:3d    # cena 3D em Chromium real (precisa de build)
```
