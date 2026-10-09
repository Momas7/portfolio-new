'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Project } from '@/data/projects'
import { useLang } from '@/lib/i18n'

interface ProjectModalProps {
  project: Project | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduce = useReducedMotion()
  const { t, l } = useLang()

  useEffect(() => {
    if (!project) return
    const previous = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <div className="modal-root">
          <motion.div
            className="modal-backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <button ref={closeRef} type="button" className="modal-close" onClick={onClose}>
              {t('close')}
            </button>

            {project.image && (
              <div className="modal-shot">
                <Image
                  src={project.image}
                  alt={`${t('screenshot')} ${project.title}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 900px"
                  style={{ objectFit: 'cover', objectPosition: 'top' }}
                />
              </div>
            )}

            <div className="modal-body">
              <p className="modal-meta">{project.year}</p>
              <h2 id="modal-title" className="modal-title">
                {project.title}
              </h2>
              <p className="modal-subtitle">{l(project.subtitle)}</p>
              <p className="modal-desc">{l(project.description)}</p>
              <ul className="about-stack" aria-label={t('tech')}>
                {project.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <div className="modal-links">
                {project.live && (
                  <a href={project.live} target="_blank" rel="noopener noreferrer">
                    {t('openProject')}
                  </a>
                )}
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    {t('viewCode')}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
