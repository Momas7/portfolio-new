'use client'

import { useSyncExternalStore } from 'react'

// Tradução PT/EN sem dependências. Idioma salvo em localStorage ('lang').

export type Lang = 'pt' | 'en'
export type Localized = Record<Lang, string>

const KEY = 'lang'
const listeners = new Set<() => void>()

function getLang(): Lang {
  try {
    return localStorage.getItem(KEY) === 'en' ? 'en' : 'pt'
  } catch {
    return 'pt'
  }
}

function setLang(lang: Lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {}
  document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR'
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const dict = {
  pageTitle: { pt: 'Lucas | Desenvolvedor Full Stack', en: 'Lucas | Full Stack Developer' },
  skip: { pt: 'Pular para o conteúdo', en: 'Skip to content' },
  home: { pt: 'Lucas Matos, voltar ao início', en: 'Lucas Matos, back to top' },
  role: { pt: 'desenvolvedor full stack', en: 'full stack developer' },
  sections: { pt: 'Seções', en: 'Sections' },
  about: { pt: 'Sobre', en: 'About' },
  projects: { pt: 'Projetos', en: 'Projects' },
  contact: { pt: 'Contato', en: 'Contact' },
  hole: { pt: 'Entrar no buraco negro e ir para Sobre', en: 'Enter the black hole and go to About' },

  aboutLead: {
    pt: 'Olá, me chamo Lucas. Construo sistemas do banco de dados até a interface, e prefiro entender o problema de verdade antes de escrever a primeira linha.',
    en: "Hi, I'm Lucas. I build systems from the database to the interface, and I'd rather truly understand the problem before writing the first line.",
  },
  aboutBody: {
    pt: 'Parte do meu trabalho é automatizar o que era manual. Quando uma tarefa repetitiva desaparece do dia a dia, sobra tempo para o que importa: produto, pessoas e detalhes.',
    en: 'Part of my work is automating what used to be manual. When a repetitive task disappears from the daily routine, there is time left for what matters: product, people and details.',
  },
  portraitAlt: { pt: 'Retrato de Lucas', en: 'Portrait of Lucas' },

  details: { pt: 'Ver detalhes', en: 'View details' },
  close: { pt: 'Fechar', en: 'Close' },
  screenshot: { pt: 'Tela do projeto', en: 'Screenshot of' },
  tech: { pt: 'Tecnologias', en: 'Technologies' },
  openProject: { pt: 'Abrir projeto', en: 'Open project' },
  viewCode: { pt: 'Ver código no GitHub', en: 'View code on GitHub' },

  contactLead: {
    pt: 'Tem um processo manual travando o time ou um produto para tirar do papel? Escreve aqui ou fala direto comigo.',
    en: 'Got a manual process slowing your team down, or a product to get off the ground? Write here or reach me directly.',
  },
  name: { pt: 'Seu nome', en: 'Your name' },
  contactField: { pt: 'Email ou telefone', en: 'Email or phone' },
  optional: { pt: '(opcional)', en: '(optional)' },
  message: { pt: 'Mensagem', en: 'Message' },
  messagePlaceholder: {
    pt: 'Conte o que você precisa: um produto, uma automação, uma vaga.',
    en: 'Tell me what you need: a product, an automation, a job opening.',
  },
  sendEmail: { pt: 'Enviar por email', en: 'Send by email' },
  sendWhatsapp: { pt: 'Enviar pelo WhatsApp', en: 'Send on WhatsApp' },
  readyEmail: {
    pt: 'Mensagem pronta no seu app de email. Confira e envie por lá.',
    en: 'Message ready in your email app. Review it and send it there.',
  },
  readyWhatsapp: {
    pt: 'Mensagem pronta no WhatsApp. Confira e envie por lá.',
    en: 'Message ready on WhatsApp. Review it and send it there.',
  },
  waGreeting: { pt: 'Olá, Lucas! Aqui é', en: "Hi Lucas! This is" },
  mailSubject: { pt: 'Contato pelo portfólio', en: 'Portfolio contact' },

  backToTop: { pt: 'voltar ao topo', en: 'back to top' },
  theme: { pt: 'Trocar tema. Atual:', en: 'Change theme. Current:' },
  light: { pt: 'Claro', en: 'Light' },
  dark: { pt: 'Escuro', en: 'Dark' },
  system: { pt: 'Sistema', en: 'System' },
  switchLang: { pt: 'Mudar idioma para inglês', en: 'Switch language to Portuguese' },
} satisfies Record<string, Localized>

export type DictKey = keyof typeof dict

export function useLang() {
  const lang = useSyncExternalStore(subscribe, getLang, () => 'pt' as Lang)
  return {
    lang,
    t: (key: DictKey) => dict[key][lang],
    l: (value: Localized) => value[lang],
    toggle: () => setLang(lang === 'pt' ? 'en' : 'pt'),
  }
}
