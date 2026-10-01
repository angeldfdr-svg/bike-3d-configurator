# PROJECT_STATE — Bike Configurator 3D

Última atualização: 2026-10-01

## Objetivo
Criar um configurador premium de bicicletas com componentes intercambiáveis em 3D, preço e peso em tempo real, regras explícitas de compatibilidade e uma arquitetura preparada para serviços reais.

## Inspeção inicial
- `/home/user` estava vazio. Nenhum código, manifest, dependência local, modelo ou componente existente para reutilizar.
- Ferramentas disponíveis: Node.js 20.20.2, npm 10.8.2, Git 2.47.3, Python e ferramentas de ficheiros/processos/pesquisa do ambiente.
- MCP: não há servidores ou ferramentas MCP expostos nesta sessão.
- ECC: nenhuma ferramenta ou configuração ECC exposta nesta sessão. Não será simulada nem anunciada como usada.
- Git ainda não inicializado no momento da inspeção.

## Arquitetura proposta
- `src/app`: Next.js App Router, layout, metadata, homepage e `/configurator`.
- `src/components/ui`: primitivas locais shadcn/ui; acessibilidade e estilos comuns.
- `src/components/layout`: header e footer.
- `src/components/home`: experiência inicial.
- `src/components/configurator`: shell, categorias e resumo (sem lógica de domínio).
- `src/components/3d`: cena e peças procedurais (Fases 4–5).
- `src/data`: catálogo tipado e futuramente adaptador de repositório (Fase 2).
- `src/types`: tipos de produtos e configuração (Fase 2).
- `src/store`: Zustand e seletores (Fase 3).
- `src/lib`: utilitários de UI; módulos puros para cálculos e compatibilidade nas fases correspondentes.
- `src/services`: contratos de persistência/API (quando necessários; não adicionar endpoints fictícios).
- `tests`: testes críticos à medida que a lógica é implementada; smoke tests da UI inicial.
- `public`: assets locais, sem modelos GLB externos obrigatórios.

## Tecnologias
Fase 1: Next.js, React, TypeScript strict, Tailwind CSS, primitivas shadcn/ui locais, ícones Lucide e animações CSS respeitando reduced motion.
Planeadas, ainda não necessárias na Fase 1: Zustand (Fase 3), Three.js + React Three Fiber + Drei (Fase 4), Zod (validação de catálogo/persistência).
A animação inicial usa CSS, evitando uma dependência de animação apenas para transições simples. Framer Motion pode ser introduzido se o fluxo futuro justificar.

## Fase atual
Fase 1 — arquitetura, configuração inicial e UI inicial (em preparação).

## Funcionalidades concluídas
- Inspeção do diretório e ferramentas disponíveis.
- Proposta concreta de arquitetura e limites de escopo.

## Funcionalidades pendentes da Fase 1
- Inicialização Next.js, TS estrito, Tailwind e lint.
- Landing page premium com título e subtítulo pedidos.
- Navegação para shell de configurador com oito categorias.
- Componentes UI acessíveis e responsivos.
- Metadata, Open Graph, asset editorial local.
- Typecheck, lint, build e testes de navegação/interface.
- README inicial, commits pequenos e preview.

## Decisões técnicas
- Trabalhar somente a Fase 1 neste turno; parar após verificação.
- Não implementar prematuramente catálogo, Zustand, preço/peso, regras ou cena 3D.
- Uma imagem editorial serve apenas como direção visual inicial. Não fingir que é um modelo 3D nem oferecer rotação falsa.
- Não mostrar preço, peso ou compatibilidade fictícios no shell.
- Só instalar dependências necessárias à fase em curso; usar package-lock e npm.
- Sem endpoints de backend, checkout, login ou integração GitHub simulados.
- Git local com commits descritivos; publicar no GitHub requer remoto/credenciais posteriormente.

## Problemas conhecidos
- Repositório vazio: é necessário criar a base.
- MCP/ECC indisponíveis: verificações feitas com ferramentas de execução e testes disponíveis.
- Não há catálogo ou modelos 3D fornecidos; são trabalho futuro, não defeitos da Fase 1.

## Próximo passo recomendado
Implementar apenas Fase 1 seguindo `docs/TECHNICAL_ROADMAP.md`; executar verificações, atualizar este ficheiro e parar antes da Fase 2.
