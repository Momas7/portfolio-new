export interface Project {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
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
    subtitle: 'Mini-Zapier interno de alertas',
    description:
      'Motor genérico de regras em Node + TypeScript: gerentes cadastram uma regra uma vez (evento → condição → ação) e o motor avalia cada evento e dispara sozinho — sem checar dashboard. Strategy, Factory, Observer, Chain of Responsibility, Composite e Repository aplicados de propósito, com API Express + Prisma e dashboard em Next.js + Chakra UI.',
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
    subtitle: 'Sistema de chamados com IA (estilo GLPI)',
    description:
      'Sistema de chamados com automações de IA: triagem automática de categoria, prioridade e equipe, sugestão de resposta com RAG sobre a base de conhecimento, detecção de duplicados e agrupamento de chamados parecidos em incidentes — a IA propõe, uma pessoa decide. TypeScript de ponta a ponta com Next.js (App Router + Route Handlers), worker de jobs com pg-boss, PostgreSQL + pgvector via Prisma e deploy em Docker. Dados sensíveis mascarados antes de sair para o LLM e toda chamada de IA auditada.',
    tags: ['TypeScript', 'Next.js', 'Prisma', 'PostgreSQL'],
    color: '#EFF6FF',
    image: '/sentinela.png',
    github: 'https://github.com/Momas7/sentinela',
    year: '2026',
  },
]
