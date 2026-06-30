import { useTranslations } from 'next-intl';
import { UseCaseRow, useCases } from '@/entities/use-case';
import styles from './use-cases.module.css';

/**
 * 서비스 활용 사례 섹션. (구 `/services` 페이지 콘텐츠를 랜딩으로 이전)
 * 카피는 `messages` 의 `servicesPage.*` 를 그대로 사용.
 */
export function UseCases() {
  const t = useTranslations('servicesPage');
  return (
    <section className="use-cases" id="use-cases">
      <div className={`about-section-head ${styles['head']}`}>
        <span className="section-tag">{t('tag')}</span>
        <h2>
          {t('headlineLine1')}
          <br />
          {t('headlineLine2')}
        </h2>
        <p>{t('sub')}</p>
      </div>

      {useCases.map((uc) => (
        <UseCaseRow
          key={uc.id}
          useCase={{
            ...uc,
            title: t(`useCases.${uc.id}.title`),
            body: t.raw(`useCases.${uc.id}.body`) as string[],
          }}
        />
      ))}
    </section>
  );
}
