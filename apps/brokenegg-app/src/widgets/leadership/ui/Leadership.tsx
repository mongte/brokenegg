import styles from './leadership.module.css';

interface Leader {
  name: string;
  role: string;
  focus: string;
}

const LEADERS: Leader[] = [
  {
    name: '이상문',
    role: 'CEO',
    focus: 'VR 전시관 설치·운영, 차량 VR 품평 시뮬레이션, 대기업 XR 외주개발 PM',
  },
  {
    name: '백인칠',
    role: 'CTO',
    focus: '실시간 3D 엔진·플러그인 개발, 반응형 3D 미디어 파이프라인 설계',
  },
];

// 리더십이 거쳐온 주요 협업/재직 이력 (출처: brokenegg.co.kr/TEAM).
const BACKGROUND = [
  '현대자동차',
  '대동공업',
  '알텐코리아',
  '코웨이',
  'POSCO',
  '빈스튜디오',
  'The Pinkfong Company',
  'SBS A&T',
  '덱스터스튜디오',
  '대원미디어',
];

export function Leadership() {
  return (
    <section className="about-leadership">
      <div className="about-section-head">
        <span className="section-tag">Leadership</span>
        <h2>현장에서 쌓은 XR · 3D 전문성</h2>
        <p>완성차 · 가전 · 미디어 현장에서 검증된 인력이 직접 솔루션을 설계합니다.</p>
      </div>

      <div className={styles['leader-grid']}>
        {LEADERS.map((l) => (
          <article className={styles['leader-card']} key={l.name}>
            <div className={styles['leader-role']}>{l.role}</div>
            <h3 className={styles['leader-name']}>{l.name}</h3>
            <p className={styles['leader-focus']}>{l.focus}</p>
          </article>
        ))}
      </div>

      <div className={styles['leader-background']}>
        <span className={styles['leader-background-label']}>주요 경력</span>
        <ul className={styles['leader-background-tags']}>
          {BACKGROUND.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
