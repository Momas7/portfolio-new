'use client'

import Image from 'next/image'
import { useLang } from '@/lib/i18n'

export default function About() {
  const { t } = useLang()
  return (
    <div className="about">
      <div className="about-text">
        <p className="about-lead">{t('aboutLead')}</p>
        <p>{t('aboutBody')}</p>
      </div>
      <figure className="about-portrait">
        <Image
          src="/lucas.png"
          alt={t('portraitAlt')}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          style={{ objectFit: 'cover' }}
        />
      </figure>
    </div>
  )
}
