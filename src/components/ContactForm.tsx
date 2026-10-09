'use client'

import { FormEvent, useState } from 'react'
import { useLang } from '@/lib/i18n'

// Sem backend: monta a mensagem e abre o app de email ou o WhatsApp
// já preenchidos. Nada é enviado sem a pessoa confirmar no próprio app.

const EMAIL = 'lucas11moraes@hotmail.com'
const WHATSAPP = '5571991676668'

type Channel = 'email' | 'whatsapp'

export default function ContactForm() {
  const [status, setStatus] = useState<Channel | null>(null)
  const { t } = useLang()

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    const channel: Channel = submitter?.value === 'whatsapp' ? 'whatsapp' : 'email'

    const data = new FormData(form)
    const name = String(data.get('name') ?? '').trim()
    const contact = String(data.get('contact') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const body = `${message}\n\n${name}${contact ? `\n${contact}` : ''}`

    if (channel === 'whatsapp') {
      const text = encodeURIComponent(`${t('waGreeting')} ${name}.\n\n${message}`)
      window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank', 'noopener,noreferrer')
    } else {
      const subject = encodeURIComponent(`${t('mailSubject')}: ${name}`)
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`
    }
    setStatus(channel)
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="cf-name">{t('name')}</label>
        <input id="cf-name" name="name" type="text" autoComplete="name" required maxLength={80} />
      </div>
      <div className="field">
        <label htmlFor="cf-contact">
          {t('contactField')} <span className="field-optional">{t('optional')}</span>
        </label>
        <input id="cf-contact" name="contact" type="text" autoComplete="email" maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="cf-message">{t('message')}</label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          maxLength={2000}
          placeholder={t('messagePlaceholder')}
        />
      </div>

      <div className="contact-actions">
        <button type="submit" value="email" className="btn btn-primary">
          {t('sendEmail')}
        </button>
        <button type="submit" value="whatsapp" className="btn">
          {t('sendWhatsapp')}
        </button>
      </div>

      <p className="contact-status" role="status" aria-live="polite">
        {status === 'email' && t('readyEmail')}
        {status === 'whatsapp' && t('readyWhatsapp')}
      </p>
    </form>
  )
}
