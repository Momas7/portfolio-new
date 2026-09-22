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
    id: 'ecommerce',
    number: '02',
    title: 'E-Commerce Platform',
    subtitle: 'Plataforma de vendas online',
    description:
      'Plataforma completa de e-commerce com carrinho de compras, integração com Stripe para pagamentos, painel administrativo e sistema de gestão de estoque. Design responsivo com foco em conversão e UX.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'],
    color: '#EEF2FF',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2024',
  },
  {
    id: 'taskmanager',
    number: '03',
    title: 'Task Manager',
    subtitle: 'Gestão de tarefas em tempo real',
    description:
      'Aplicação de gerenciamento de tarefas com drag-and-drop, filtros avançados, colaboração em tempo real via WebSockets e notificações push. Interface limpa e intuitiva.',
    tags: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    color: '#FEF3C7',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2024',
  },
  {
    id: 'dashboard',
    number: '04',
    title: 'Analytics Dashboard',
    subtitle: 'Visualização de dados interativa',
    description:
      'Dashboard interativo para visualização de dados financeiros com gráficos dinâmicos, relatórios exportáveis e alertas personalizados. Performance otimizada para grandes datasets.',
    tags: ['React', 'D3.js', 'Express', 'PostgreSQL'],
    color: '#ECFDF5',
    github: 'https://github.com',
    year: '2023',
  },
  {
    id: 'blogcms',
    number: '05',
    title: 'Blog CMS',
    subtitle: 'Sistema de conteúdo headless',
    description:
      'CMS headless para blogs com editor rich-text, otimização SEO automática, deploy contínuo e suporte a múltiplos autores. Geração estática para máxima performance.',
    tags: ['Next.js', 'MDX', 'Tailwind', 'Vercel'],
    color: '#FDF2F8',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2023',
  },
  {
    id: 'chatapp',
    number: '06',
    title: 'Chat Application',
    subtitle: 'Mensageria em tempo real',
    description:
      'Aplicação de chat em tempo real com suporte a grupos, envio de arquivos, reações e histórico de mensagens. Criptografia end-to-end e interface moderna.',
    tags: ['React', 'Firebase', 'WebRTC', 'TypeScript'],
    color: '#F0F9FF',
    github: 'https://github.com',
    year: '2023',
  },
  {
    id: 'portfolio',
    number: '07',
    title: 'Creative Portfolio',
    subtitle: 'Este portfólio',
    description:
      'Portfólio interativo com animações cinematográficas, cursor customizado e transições fluidas. Construído com foco em experiência do usuário e performance.',
    tags: ['Next.js', 'Chakra UI', 'Framer Motion'],
    color: '#F5F3FF',
    github: 'https://github.com',
    live: 'https://example.com',
    year: '2024',
  },
]
