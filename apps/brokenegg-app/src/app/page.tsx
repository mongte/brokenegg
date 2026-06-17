import Image from 'next/image';

const problems = [
  {
    num: '01 / LIMITATION',
    title: '설명의 한계',
    body: '복잡한 설비와 정밀 부품, 2D 이미지와 텍스트만으로는 고객에게 제품의 진정한 가치를 전달하기 어렵습니다.',
  },
  {
    num: '02 / SAFETY',
    title: '안전 교육의 공백',
    body: '현장 실습의 위험성과 비용 문제로 인해 실제와 같은 몰입형 교육 환경 구축이 시급합니다.',
  },
  {
    num: '03 / ESG',
    title: '지속 가능한 대응',
    body: '종이 매뉴얼과 물리적 샘플 제작을 줄이고, 디지털 트윈을 통한 탄소 배출 저감이 기업의 필수 과제가 되었습니다.',
  },
];

const services = [
  {
    code: 'BE-01',
    tag: 'LIVE INTERACTIVE',
    category: 'Product Visualization',
    name: 'Egg One',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
  },
  {
    code: 'BE-02',
    tag: 'MEDIA ENGINE',
    category: 'Interactive 3D Media',
    name: 'Egg Two',
    image:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
  },
  {
    code: 'BE-XR',
    tag: 'VR/AR/MR',
    category: 'Industrial Training',
    name: 'XR Safety',
    image:
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800',
  },
  {
    code: 'CUSTOM',
    tag: 'R&D LAB',
    category: 'Enterprise Solution',
    name: 'Custom Lab',
    image:
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
  },
];

const testimonials = [
  {
    quote:
      '브로큰에그의 3D 시뮬레이션 덕분에 해외 바이어들에게 우리 제품의 내부 구조를 완벽하게 시연할 수 있었습니다. 매출 성장의 핵심 도구입니다.',
    name: '김진우',
    role: 'H-Industrial 마케팅 팀장',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
  },
  {
    quote:
      '위험 요소가 많은 화학 공정 교육을 XR로 전환한 후 신입 사원 사고율이 40% 감소했습니다. 가장 혁신적인 안전 솔루션입니다.',
    name: '이서윤',
    role: 'K-Energy 안전관리본부',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
  },
];

export default function Index() {
  return (
    <>
      <div className="grid-bg" />

      <div className="canvas">
        <header>
          <div className="nav-left">
            <div className="badge active">PRODUCT</div>
            <div className="badge">SIMULATION</div>
            <div className="badge">SAFETY</div>
          </div>
          <div className="logo">Broken Egg</div>
          <div className="nav-right">
            <a href="#demo" className="badge">
              DEMO REQUEST
            </a>
            <div className="menu-toggle" />
          </div>
        </header>

        <section className="hero">
          <span className="section-tag">Intro</span>
          <h1 className="hero-headline">
            도면 속에 갇혀 있던 제품을,
            <br />
            손으로 만지듯 보여주세요
          </h1>
          <div className="hero-ctas">
            <a href="#demo" className="btn btn-primary">
              데모 요청하기
            </a>
            <a href="#services" className="btn btn-secondary">
              서비스 살펴보기
            </a>
          </div>
        </section>

        <div className="section-header">
          <div className="tags-row">
            <div className="badge">CLIMATE CHANGE</div>
            <div className="badge">SAFETY FIRST</div>
            <div className="badge">INNOVATION</div>
            <div className="badge">ESG COMPLIANCE</div>
          </div>
          <div className="sort-by">
            Sort by <span>NEWEST</span>
          </div>
        </div>

        <section className="problem-grid">
          {problems.map((p) => (
            <div className="problem-card" key={p.num}>
              <span className="num">{p.num}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </div>
          ))}
        </section>

        <section className="services-grid" id="services">
          {services.map((s) => (
            <div className="service-item" key={s.code}>
              <Image
                src={s.image}
                alt={s.name}
                fill
                sizes="(max-width: 1024px) 100vw, 25vw"
              />
              <div className="service-overlay">
                <div className="service-meta">
                  <div
                    className="badge"
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                    }}
                  >
                    {s.code}
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700 }}>
                    {s.tag}
                  </span>
                </div>
                <div className="service-info">
                  <span>{s.category}</span>
                  <h4>{s.name}</h4>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="testimonials">
          <div className="testimonial-track">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="quote">{t.quote}</div>
                <div className="quote-author">
                  <div className="author-avatar">
                    <Image src={t.avatar} alt={t.name} fill sizes="40px" />
                  </div>
                  <div className="author-info">
                    <div>{t.name}</div>
                    <div>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta" id="demo">
          <h2>
            지금 브로큰에그의
            <br />
            미래형 솔루션을 경험하세요.
          </h2>
          <a
            href="#demo"
            className="btn btn-primary"
            style={{ padding: '20px 60px', fontSize: '18px' }}
          >
            데모 요청하기
          </a>
        </section>

        <footer>
          <div>© 2024 Broken Egg Inc. All Rights Reserved.</div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Contact</span>
          </div>
          <div>[REF: BRK-EGG-2024-V1]</div>
        </footer>
      </div>
    </>
  );
}
