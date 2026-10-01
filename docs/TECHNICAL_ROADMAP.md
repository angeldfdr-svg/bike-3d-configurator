# Roadmap técnico

## Princípios
Incrementos pequenos, TypeScript estrito, domínio independente da UI, ausência de integrações fictícias e validação ao terminar cada fase. Os modelos GLB são opcionais e substituem as geometrias procedurais depois de o fluxo estar demonstrado. MCP/ECC só serão usados se estiverem efetivamente disponíveis.

| Fase | Entregável | Critérios de saída |
| --- | --- | --- |
| 1 — Base + UI | Next App Router, TS strict, Tailwind, UI shadcn local, homepage premium, shell `/configurator`, metadata, assets locais e documentação | Build, typecheck, lint, navegação, mobile e acessibilidade básica verificados; nenhuma simulação de configuração funcional |
| 2 — Catálogo | `ComponentBase`, `BikeFrame`, `Wheelset`, `Groupset`, `Crankset`, `Handlebar`, `Saddle`, `Tire`, `Accessory`; dados separados por categoria; atributos explícitos de eixos, travões, freehub, BB e interfaces | Catálogo inicial validado; IDs únicos e unidades consistentes (cêntimos e gramas); produtos demonstrativos claramente identificados |
| 3 — Estado | Zustand: seleção, configuração inicial, loading, câmara, configuração guardada; ações tipadas; seletores granulares | Testes de seleção, reset e configuração inicial; sem lógica de negócio nos componentes visuais |
| 4 — Cena 3D | React Three Fiber, Three.js, Drei, Canvas lazy, Suspense, fallback de WebGL, OrbitControls e vistas predefinidas | Bicicleta procedural centrada; zoom/orbit e vistas frontal/lateral/traseira/superior; fallback acessível |
| 5 — Peças | Frame, Wheels, Groupset, Crankset, Handlebar, Saddle, Tires e extras separados; registry para GLB futuros | Todas as seleções com representação visual adequada; geometria reutilizada; transformações e escala consistentes |
| 6 — Totais | Funções puras de preço/peso, políticas de quantidades e arredondamento, formatadores PT | Testes de soma, quantidades, estado incompleto e unidades; sem dupla contagem de peças incluídas no grupo |
| 7 — Compatibilidade | Pipeline modular de regras, severidade e mensagens; compatibilidade de cassete/freehub, velocidades, BB, pneus, eixos, travagem, guiador/potência, espigão | Testes por regra e combinações; configurações inválidas explicitamente assinaladas e bloqueadas em ações relevantes |
| 8 — Responsividade | Configurador desktop split; mobile 3D → componentes → resumo; controlos touch | Validação tablet/mobile, scroll, foco e ausência de overflow |
| 9 — Acabamento | Microanimações, transições de seleção, estados vazios/loading/erro; motion só se necessário | Reduced motion, teclado, contraste e feedback de ações |
| 10 — Qualidade | Suite domínio + integração + navegador, perfil de render, lazy GLB, limites de DPR e efeitos | Build/TS/lint/testes verdes; medição de desempenho documentada sem métricas inventadas |
| 11 — Deploy | README completo, revisão de estrutura, env.example quando necessário, configuração de produção | Deploy documentado, sem segredos, lockfile, commits pequenos; revisão final de SEO |

## Contratos e limites futuros
- Repositório de catálogo: fonte local inicialmente, adaptável a API sem acoplar componentes a fetch.
- Configuração serializável e versionada com IDs dos produtos, tamanho/cor e extras. Validação Zod quando for implementada.
- Cálculos puros e regras recebem catálogo + configuração; não dependem de Zustand nem React.
- Adaptador de modelos associa IDs a geometrias procedurais ou GLB lazy e metadados de montagem.
- Persistência por interface para local/API futura; autenticação, checkout, inventário e partilha não estão no escopo inicial.
- Produtos e compatibilidades precisam de dados técnicos verificados antes de utilização comercial.

## Fase 1: sequência de commits
1. `docs: record repository inspection and phased architecture`
2. `chore: scaffold strict Next.js application`
3. `feat: add premium landing page and configurator shell`
4. `test: verify phase one and document handoff`

## Paragem obrigatória
Após a Fase 1, atualizar PROJECT_STATE com resultados reais e próximo bloco. Não iniciar a Fase 2 sem continuação do utilizador.
