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
  nem anunciado como usado; a verificação foi feita com as ferramentas de execução, lint,
  typecheck, build e smoke test disponíveis.
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
│  └─ 3d/            (Fase 4–5) ainda não criado
├─ config/           site.ts (copy, navegação, processo), configurator.ts (categorias, vistas, regras planeadas)
├─ lib/              utils.ts (cn), site-url.ts
├─ data/             (Fase 2) catálogo
├─ store/            (Fase 3) Zustand
└─ services/         (futuro) persistência e API
public/images/       bike-hero.webp, bike-stage.webp, og-cover.jpg
docs/                TECHNICAL_ROADMAP.md
scripts/             smoke.mjs (teste de rota/SEO/assets sem dependências)
```

## Tecnologias instaladas
Next.js 16.3.8, React 19.3.0, TypeScript 5.9.3, Tailwind CSS 4.3.3, ESLint 9.39.5,
eslint-config-next 16.3.8, class-variance-authority, clsx, tailwind-merge, lucide-react.
Tipos: `@types/node`, `@types/react`, `@types/react-dom`.

Planeado e deliberadamente **não** instalado nesta fase: Zustand (Fase 3), Three.js +
React Three Fiber + Drei (Fases 4–5), Zod (Fase 2). A animação da landing page usa CSS,
pelo que Framer Motion não foi adicionado.

## Fase atual
**Fase 1 concluída e verificada.**

## Funcionalidades concluídas
- Repositório Git inicializado com commits pequenos e descritivos.
- Next.js App Router + TypeScript estrito (`strict`, `noUncheckedIndexedAccess`,
  `noUnusedLocals`, `noUnusedParameters`, `noImplicitOverride`, `noFallthroughCasesInSwitch`).
- Tailwind CSS 4 com design system em `@theme` (superfícies, linhas, texto, acento, raios,
  microanimações) e respeito por `prefers-reduced-motion`.
- Landing page premium: hero `BUILD YOUR BIKE` + subtítulo e CTA pedidos, oito categorias,
  processo em três passos, secção de compatibilidade, fecho com CTA.
- Shell do configurador em `/configurator`: palco, controlos de câmara, oito categorias em
  acordeão acessível, painel de resumo e painel de estado do projeto.
- SEO: metadata, Open Graph, Twitter Card, `robots.txt`, `sitemap.xml`, `lang="pt-PT"`,
  *skip link*, landmarks, foco visível, 404.
- Responsividade: desktop, portátil, tablet e telemóvel (ordem 3D → componentes → resumo).
- Assets editoriais locais gerados e optimizados (WebP/JPEG), sem CDN em runtime.
- Smoke test sem dependências (`npm run smoke`): 25 verificações, todas a passar.

## Verificações executadas
| Comando | Resultado |
| --- | --- |
| `npx tsc --noEmit` | ✅ 0 erros |
| `npx eslint .` | ✅ 0 erros, 0 avisos |
| `npx next build --webpack` | ✅ 5 rotas estáticas (`/`, `/_not-found`, `/configurator`, `/robots.txt`, `/sitemap.xml`) |
| `npm run smoke` | ✅ 25 passed, 0 failed |

Problemas encontrados e resolvidos durante a verificação:
1. Caminho das fontes em `next/font/local` apontava um nível acima — corrigido para
   `../assets/fonts/...`; o build falhou e passou a compilar.
2. ESLint 10.11 é incompatível com o plugin de React incluído no `eslint-config-next` 16
   (`context.getFilename` removido). Resolvido fixando ESLint na linha 9.x.
3. A config global de lint sobrepunha-se ao override de `scripts/`; a ordem foi corrigida.

## Decisões técnicas
- **Fase 1 não simula funcionalidade.** Preço, peso, especificações e compatibilidade
  aparecem como `—` com a fase em que ficam ativos; as vistas de câmara estão desativadas e
  justificadas. Nenhum produto, preço ou especificação técnica foi inventado.
- A bicicleta da landing page e do palco é uma **imagem editorial**, identificada como
  "Referência visual". Não há falsa rotação 3D nesta fase.
- Oito categorias e os seus atributos são dados de **estrutura** (`src/config`), não
  catálogo de produtos.
- `Button` e `LinkButton` partilham `buttonVariants` (CVA), evitando uma dependência de
  slot polimórfico e mantendo tipos estritos.
- TypeScript estrito desde o início, incluindo `noUncheckedIndexedAccess`.
- Um único pacote de animação não foi adicionado: as transições da Fase 1 são CSS.
- Build validado com webpack por limitação de CPU/memória do ambiente (2 vCPU, 2 GB);
  `npm run build` mantém o padrão Turbopack do Next 16.

## Problemas conhecidos
- Ambiente de build com 2 vCPU e 2 GB RAM: builds longos podem ser lentos. O build webpack
  desta fase compilou em ~20 s.
- Marca (`VELOCE`), produtos e mensagens são fictícios; o catálogo real exige dados técnicos
  verificados.
- Sem MCP/ECC disponíveis nesta sessão: a verificação assenta em typecheck, lint, build e
  smoke test.
- Sem remoto GitHub configurado: `git push` precisa do repositório e credenciais do
  utilizador.

## Próximo passo recomendado
Iniciar a **Fase 2 — sistema de dados dos componentes**: definir `ComponentBase`, `BikeFrame`,
`Wheelset`, `Groupset`, `Crankset`, `Handlebar`, `Saddle`, `Tire` e `Accessory` em
`src/types`, com atributos técnicos necessários às regras de compatibilidade (eixos,
travagem, freehub, BB, diâmetro de espigão, largura máxima de pneus), e um catálogo
inicial em `src/data` claramente identificado como demonstrativo. Validar com typecheck,
lint e build antes de avançar.
