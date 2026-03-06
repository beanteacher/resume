'use client'

const CONTACTS = [
  { icon: '💻', label: 'GitHub', href: 'https://github.com/beanteacher', desc: '@beanteacher' },
  { icon: '✍️', label: 'Blog', href: 'https://velog.io/@mings/posts', desc: 'velog.io/@mings' },
  { icon: '📧', label: 'Email', href: 'mailto:dh65432@naver.com', desc: 'dh65432@naver.com' },
]

export function ContactSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
      {CONTACTS.map((contact) => {
        const isMailto = contact.href.startsWith('mailto:')
        return (
          <a
            key={contact.label}
            href={contact.href}
            {...(!isMailto && { target: '_blank', rel: 'noopener noreferrer' })}
            className="
              bg-[var(--surface)] border border-[var(--border-color)] rounded-[var(--radius-md)] p-6
              flex flex-col items-center text-center gap-2
              hover:border-[var(--color-brand-purple)]/50 hover:shadow-[var(--shadow-md)] hover:-translate-y-1
              transition-all duration-[var(--transition-base)]
            "
          >
            <span className="text-3xl">{contact.icon}</span>
            <h3 className="text-[var(--font-size-body1)] font-[var(--font-weight-subheading)] text-[var(--text)]">
              {contact.label}
            </h3>
            <p className="text-[var(--font-size-caption)] text-[var(--text-muted)]">{contact.desc}</p>
          </a>
        )
      })}
    </div>
  )
}
