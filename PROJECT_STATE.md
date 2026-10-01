# PROJECT_STATE

Estado vivo do projeto. Actualizado no fim de cada fase; a fonte de verdade para
"o que está feito, o que falta e o que decidir a seguir".

- **Fase actual:** 4 de 11 — concluída e verificada
- **Branch:** `main` (repositório local, sem remoto configurado)
- **Última verificação completa:** typecheck, lint, testes, build, smoke e verificação
  da cena 3D em Chromium real — todos verdes

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

**Decisões de produto fixas:** marca fictícia `VELOCE`; produtos, preços e pesos
ilustrativos; interface em português de Portugal; nada é simulado — o que ainda não
existe aparece identificado como fase futura.

---

## 2. Fases

| Fase | Conteúdo | Estado |
| --- | --- | --- |
| 1 | Arquitectura, configuração, landing page, shell do configurador, SEO | ✅ concluída |
| 2 | Modelo de dados, catálogo (31 produtos), validação Zod, testes | ✅ concluída |
| 3 | Zustand: selecção, configuração, câmara, persistência | ✅ concluída |
| 4 | Cena 3D (R3F, Drei, Suspense, fallback WebGL, vistas de câmara) | ✅ concluída |
| 5 | Peças 3D intercambiáveis + registry para GLB/GLTF lazy | ⏳ próxima |
| 6 | Preço e peso em tempo real (funções puras + testes) | pendente |
| 7 | Motor de compatibilidade modular (regras, severidade, mensagens) | pendente |
| 8 | Responsividade do configurador (desktop split, mobile empilhado) | pendente |
| 9 | Microanimações, transições, estados vazios/erro/carregamento | pendente |
| 10 | Testes de domínio e interface, performance 3D | pendente |
| 11 | Limpeza, revisão final, preparação para deploy | pendente |

---

## 3. Fase 4 — o que foi feito

### 3.1 Geometria procedural (`src/lib/3d/bike-geometry.ts`)

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

### 3.2 Enquadramento (`src/lib/3d/camera-views.ts`)

`resolveCameraPreset(view, geometry)` devolve posição e alvo para as quatro vistas,
com a distância calculada a partir da FOV vertical (35°), do *aspect* do palco (16:10)
e da extensão relevante da bicicleta em cada vista (comprimento de lado, largura do
guiador de frente). `framingFits(view, geometry)` é a invariante testada: a bicicleta
nunca é cortada.

A vista superior é inclinada (52° de elevação, 30° de azimute) porque olhar exactamente
de cima deixa o vetor *up* paralelo à direcção da vista, o que é indefinido.

### 3.3 Cena (`src/components/3d/`)

| Ficheiro | Papel |
| --- | --- |
| `stage-canvas.tsx` | entrada pública; lazy, fallbacks, deteção de WebGL, descrição acessível |
| `bike-scene.tsx` | `Canvas`, luzes, `Suspense`, câmara inicial |
| `bike-model.tsx` | monta as peças a partir da geometria + sombra em canvas |
| `camera-rig.tsx` | vistas, rotação automática e `OrbitControls` num único `useFrame` |
| `scene-boundary.tsx` | error boundary da cena |
| `webgl-support.ts` | deteção via `useSyncExternalStore` (sem *hydration mismatch*) |
| `materials.ts` | paleta de materiais partilhada |
| `tube.tsx` | cilindro entre dois pontos |
| `parts/frame.tsx` | triângulo principal, escoras, espigão, forquilha |
| `parts/wheels.tsx` | aro, raios, cubo |
| `parts/tires.tsx` | pneu, parede lateral, cassete, textura de sombra |
| `parts/groupset.tsx` | cassete, desviador, corrente, travões |
| `parts/crankset.tsx` | pratos, braços, pedais |
| `parts/handlebar.tsx` | avanço, partes de cima, drops, manetes |
| `parts/saddle.tsx` | selim e carris |

A cena lê `configuration` e `camera` do store e nunca escreve no store.

### 3.4 Interface

- `stage-panel.tsx` passou a alojar o canvas real (mira, badges, título, nota honesta).
- `camera-controls.tsx` ligado ao store: as quatro vistas e o botão `Rodar` funcionam.

---

## 4. Verificações da Fase 4

| Verificação | Resultado |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 erros |
| `npx eslint .` | ✅ 0 erros, 0 avisos |
| `npx vitest run` | ✅ **95 testes** (29 catálogo + 20 configuração + 23 store + 23 3D) |
| `npx next build --webpack` | ✅ 5 rotas estáticas |
| `npm run smoke` | ✅ 25 verificações |
| `npm run verify:3d` | ✅ 15 verificações em Chromium real |

`verify:3d` (`scripts/verify-3d.mjs`) arranca o servidor de produção, abre
`/configurator` em Chromium headless com WebGL por software (SwiftShader) e verifica:
contexto WebGL vivo, *drawing buffer* alocado, pixels desenhados, vistas predefinidas
(`aria-pressed`), mudança de enquadramento entre vistas, rotação automática ligada e
desligada, arrasto com o ponteiro, viewport móvel e ausência de erros de consola.
As capturas de ecrã ficam em `.verify/`.

### Bundle

- `/` carrega 599 KB em 8 chunks; `/configurator` carrega 606 KB em 9 chunks.
- Os ~700 KB do Three.js **não** estão em nenhum dos dois: entram apenas quando o palco
  3D monta, por causa do `dynamic(..., { ssr: false })`.
- O chunk do Zod continua diferido e fora do primeiro paint.

---

## 5. Decisões registadas

1. **Geometria procedural primeiro, GLB depois.** Nenhum asset 3D foi descarregado da
   internet: a bicicleta é construída por código. Isto mantém o repositório leve, evita
   problemas de licença e dá pontos de âncora estáveis para a Fase 5.
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

---

## 6. Problemas conhecidos

- **Turbopack inviável neste sandbox** (2 vCPU / 2 GB RAM): os builds excedem 600 s.
  Usar `npx next build --webpack`. O script `npm run build` mantém o Turbopack.
- **`.git/config` não persiste** no snapshot do workspace: ao reiniciar o ambiente é
  preciso repetir `git config user.name` / `user.email`.
- **Sem remoto GitHub**: `git push` requer repositório e credenciais do utilizador.
- **A roda e o quadro ainda são blocos**, não peças fiéis: a Fase 5 troca as formas por
  geometria específica de cada produto.
- **`frameloop` está em `always`**, porque a rotação automática precisa de frames
  contínuos. Se a performance em telemóvel for fraca, a Fase 10 deve passar para
  `demand` + `invalidate()`.
- **O selim é uma esfera escalada**, o mais fraco da modelo. Fica para a Fase 5.
- **O navegador headless usa WebGL por software**: as capturas são representativas da
  geometria, não da performance em GPU real.

---

## 7. Próximo passo — Fase 5

Peças 3D intercambiáveis:

1. Geometria específica por produto: aros de perfil diferente, quadros *aero* vs
   *gravel*, guiadores de largura/tipo diferente, selins, gruposets mecânicos vs
   electrónicos, travões de aro vs disco.
2. Registry `productId → peça`, desenhado para aceitar GLB/GLTF com *lazy loading*
   quando existirem modelos reais.
3. Reutilização de geometria e instâncias para manter a cena barata.
4. Testes das invariantes da Fase 5 (nunca uma peça incompatível é desenhada em
   silêncio).

**Critério de saída:** typecheck, lint, testes, build, smoke e `verify:3d` verdes, com
capturas das quatro vistas antes de avançar.

---

## 8. Comandos úteis

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
