import type { Localized } from '@/lib/i18n'

export interface Project {
  id: string
  number: string
  title: string
  subtitle: Localized
  description: Localized
  tags: string[]
  color: string
  image?: string
  github?: string
  live?: string
  year: string
}

export const projects: Project[] = [
  {
    id: 'alert-engine',
    number: '01',
    title: 'Alert Engine',
    subtitle: { pt: 'Mini-Zapier interno de alertas', en: 'Internal mini-Zapier for alerts' },
    description: {
      pt: 'Motor genérico de regras em Node + TypeScript: gerentes cadastram uma regra uma vez (evento → condição → ação) e o motor avalia cada evento e dispara sozinho — sem checar dashboard. Strategy, Factory, Observer, Chain of Responsibility, Composite e Repository aplicados de propósito, com API Express + Prisma e dashboard em Next.js + Chakra UI.',
      en: 'Generic rules engine in Node + TypeScript: managers register a rule once (event → condition → action) and the engine evaluates each event and fires on its own — no dashboard checking. Strategy, Factory, Observer, Chain of Responsibility, Composite and Repository applied on purpose, with an Express + Prisma API and a Next.js + Chakra UI dashboard.',
    },
    tags: ['TypeScript', 'Node.js', 'Express', 'Prisma'],
    color: '#FFF7ED',
    image: '/alert-engine-dashboard.png',
    github: 'https://github.com/Momas7/zapier',
    year: '2026',
  },
  {
    id: 'sentinela',
    number: '02',
    title: 'Sentinela',
    subtitle: { pt: 'Sistema de chamados com IA (estilo GLPI)', en: 'AI-powered ticketing system (GLPI style)' },
    description: {
      pt: 'Sistema de chamados com automações de IA: triagem automática de categoria, prioridade e equipe, sugestão de resposta com RAG sobre a base de conhecimento, detecção de duplicados e agrupamento de chamados parecidos em incidentes — a IA propõe, uma pessoa decide. TypeScript de ponta a ponta com Next.js (App Router + Route Handlers), worker de jobs com pg-boss, PostgreSQL + pgvector via Prisma e deploy em Docker. Dados sensíveis mascarados antes de sair para o LLM e toda chamada de IA auditada.',
      en: 'Ticketing system with AI automations: automatic triage of category, priority and team, reply suggestions with RAG over the knowledge base, duplicate detection and grouping of similar tickets into incidents — the AI proposes, a person decides. End-to-end TypeScript with Next.js (App Router + Route Handlers), a pg-boss job worker, PostgreSQL + pgvector via Prisma and Docker deployment. Sensitive data is masked before reaching the LLM and every AI call is audited.',
    },
    tags: ['TypeScript', 'Next.js', 'Prisma', 'PostgreSQL'],
    color: '#EFF6FF',
    image: '/sentinela.png',
    github: 'https://github.com/Momas7/sentinela',
    year: '2026',
  },
]
