import styles from './company-overview.module.css';

const OVERVIEW: { label: string; value: string }[] = [
  { label: '회사명', value: '주식회사 브로큰에그' },
  { label: '설립일', value: '2023년 07월 20일' },
  { label: '대표자', value: '이상문' },
  { label: '업종', value: '정보통신업' },
  { label: '사업', value: '반응형 3D 입체 솔루션 · 3D 반응형 미디어 · XR (VR/AR/MR)' },
  { label: '서비스', value: 'Egg One — 반응형 3D 입체 매뉴얼 · 카탈로그 · 교본' },
];

export function CompanyOverview() {
  return (
    <section className={styles['about-overview']}>
      <div className="about-overview-intro">
        <span className="section-tag">Company</span>
        <h2 className={styles['about-overview-headline']}>
          도면 속에 갇힌 제품을
          <br />
          손으로 만지듯 보여줍니다
        </h2>
        <p className={styles['about-overview-lead']}>
          브로큰에그는 복잡한 제품과 개념을 누구나 직관적으로 이해할 수 있도록, 웹에서 바로
          체험하는 반응형 3D 시뮬레이션과 XR 솔루션을 만듭니다.
        </p>
      </div>

      <dl className={styles['about-overview-table']}>
        {OVERVIEW.map((row) => (
          <div className={styles['about-overview-row']} key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
