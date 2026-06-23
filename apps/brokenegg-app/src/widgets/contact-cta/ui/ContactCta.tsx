import styles from './contact-cta.module.css';
import { MessageSquare, Mail, Phone, type LucideIcon } from 'lucide-react';
import { siteConfig } from '@/shared/config';

interface Channel {
  id: string;
  label: string;
  href: string;
  Icon: LucideIcon;
}

export function ContactCta() {
  const { phone, email } = siteConfig.contact;
  const channels: Channel[] = [
    { id: 'sms', label: '문자', href: `sms:${phone}`, Icon: MessageSquare },
    { id: 'email', label: '이메일', href: `mailto:${email}`, Icon: Mail },
    { id: 'phone', label: '전화', href: `tel:${phone}`, Icon: Phone },
  ];

  return (
    <section className={styles['contact-cta']} id="contact">
      <h2>
        궁금한 점이 있으신가요?
        <br />
        편하신 방법으로 문의해 주세요.
      </h2>

      <div className={styles['contact-channels']}>
        {channels.map(({ id, label, href, Icon }) => (
          <a key={id} href={href} className={styles['contact-channel']}>
            <span className={styles['contact-channel-icon']} aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <span className={styles['contact-channel-label']}>{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
