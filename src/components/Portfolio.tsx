'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Project, projects } from '@/data/projects'
import GravityWell from './GravityWell'
import TypedName from './TypedName'
import About from './About'
import ProjectModal from './ProjectModal'
import ContactForm from './ContactForm'
import { ModeToggle } from './mode-toggle'
import { useLang, DictKey } from '@/lib/i18n'

const sections: { id: string; label: DictKey }[] = [
  { id: 'sobre', label: 'about' },
  { id: 'projetos', label: 'projects' },
  { id: 'contato', label: 'contact' },
]

const socials = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/lucas-moraes-js/' },
  { name: 'GitHub', url: 'https://github.com/Momas7' },
]

function SectionHeading({ index, title }: { index: number; title: string }) {
  return (
    <header className="section-head">
      <span className="section-index">{String(index + 1).padStart(2, '0')}</span>
      <h2 className="section-title">{title}</h2>
    </header>
  )
}

export default function Portfolio() {
  const [selected, setSelected] = useState<Project | null>(null)
  const { lang, t, l, toggle } = useLang()

  return (
    <>
      {/* React 19 coloca no <head>; troca junto com o idioma */}
      <title>{t('pageTitle')}</title>
      <a className="skip-link" href="#conteudo">
        {t('skip')}
      </a>

      <div className="topbar">
        <a className="brand" href="#inicio" aria-label={t('home')}>
          <span className="brand-mark">L.</span>
          <span className="brand-name">lucas matos</span>
        </a>
        <div className="topbar-right">
          <span className="topbar-role">{t('role')}</span>
          <button
            type="button"
            className="lang-toggle"
            onClick={toggle}
            aria-label={t('switchLang')}
          >
            <span data-on={lang === 'pt'}>PT</span>
            <span data-on={lang === 'en'}>EN</span>
          </button>
          <ModeToggle />
        </div>
      </div>

      <section className="hero" id="inicio">
        <GravityWell targetId="sobre" label={t('hole')} hint={t('holeHint')} />
        <div className="hero-veil" aria-hidden="true" />
        <div className="shell hero-content">
          <TypedName text="Lucas Moraes Matos" />
          <p className="hero-role">{t('role')}</p>
          <nav aria-label={t('sections')}>
            <ol className="hero-nav">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    <span className="hero-nav-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="hero-nav-label">{t(s.label)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      <main id="conteudo">
        <section className="section shell" id="sobre">
          <SectionHeading index={0} title={t('about')} />
          <About />
        </section>

        <section className="section shell" id="projetos">
          <SectionHeading index={1} title={t('projects')} />
          <ul className="projects">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className="project"
                  onClick={() => setSelected(project)}
                  aria-haspopup="dialog"
                >
                  <span className="project-text">
                    <span className="project-meta">
                      {project.year} / {project.tags.slice(0, 3).join(', ')}
                    </span>
                    <span className="project-title">{project.title}</span>
                    <span className="project-subtitle">{l(project.subtitle)}</span>
                    <span className="project-open">{t('details')}</span>
                  </span>
                  <span className="project-shot">
                    {project.image && (
                      <Image
                        src={project.image}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 45vw"
                        style={{ objectFit: 'cover', objectPosition: 'top' }}
                      />
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="section shell contact" id="contato">
          <SectionHeading index={2} title={t('contact')} />
          <div className="contact-grid">
            <div className="contact-info">
              <p className="contact-lead">{t('contactLead')}</p>
              <a className="contact-mail" href="mailto:lucas11moraes@hotmail.com">
                lucas11moraes@
                <wbr />
                hotmail.com
              </a>
              <div className="contact-links">
                <a href="tel:+5571991676668">(71) 99167-6668</a>
                {socials.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <footer className="footbar">
        <span>lucas matos, {new Date().getFullYear()}</span>
        <a href="#inicio">{t('backToTop')}</a>
      </footer>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
