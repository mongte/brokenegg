import styles from './contact-cta.module.css';
import { useTranslations } from 'next-intl';
import { MessageSquare, Mail, Phone, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/shared/config';

interface Channel {
  id: 'sms' | 'email' | 'phone';
  href: string;
  Icon: LucideIcon;
}

export function ContactCta() {
  const t = useTranslations('contact');
  const { phone, email } = siteConfig.contact;
  const channels: Channel[] = [
    { id: 'sms', href: `sms:${phone}`, Icon: MessageSquare },
    { id: 'email', href: `mailto:${email}`, Icon: Mail },
    { id: 'phone', href: `tel:${phone}`, Icon: Phone },
  ];

  return (
    <section className={styles['contact-cta']} id="contact">
      <h2>
        {t('title1')}
        <br />
        {t('title2')}
      </h2>

      <div className={styles['contact-channels']}>
        {channels.map(({ id, href, Icon }) => (
          <a key={id} href={href} className={styles['contact-channel']}>
            <span className={styles['contact-channel-icon']} aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className={styles['contact-channel-label']}>{t(id)}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
