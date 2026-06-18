---
name: wiki-llm
description: >-
  Set up a reusable LLM knowledge base for a project (Karpathy-style "LLM Wiki" +
  Graphify knowledge graph + Obsidian-friendly layout) so an AI coding assistant
  answers from a compact graph instead of re-reading every file. This skill is
  COMMAND-INVOKED ONLY: use it when the user explicitly types the /wiki-llm
  command, optionally followed by a target path and a short description
  (e.g. "/wiki-llm ~/projects/app 코드랑 설계문서 지식 그래프로 만들고 싶은데 세팅").
  Do NOT auto-trigger from general conversation about docs, wikis, Obsidian,
  Graphify, or tokens — only run when /wiki-llm is explicitly invoked.
---

# wiki-llm — LLM Wiki + Graphify + Obsidian 세팅

명령어 `/wiki-llm`으로 호출되는 스킬. 프로젝트의 자료를 AI가 싸게 읽는 지식 베이스로
구성한다: 원본은 `raw/`, 가공 노트는 `wiki/`, 자동 생성 지식 지도는 `graphify-out/`.
AI는 한 페이지 요약 + 관련 그래프 노드만 보고 답한다 (원본 전체를 매번 읽지 않음).

## 명령어 인자 해석
호출 형태: `/wiki-llm [대상경로] [자연어 설명]`
- **대상경로**: 지식 베이스로 만들 폴더(또는 프로젝트 루트). 없으면 현재 폴더로 가정하고 사용자에게 확인.
- **자연어 설명**: 어떤 자료를(코드/설계문서/PDF 등) 어떤 목적으로 정리할지. 이를 반영해 폴더 분류와 노트 구성을 정한다.

예: `/wiki-llm ~/projects/app 코드랑 설계문서 지식 그래프로 만들고 싶어`
→ `~/projects/app` 안에 지식 폴더를 만들고, 코드/설계문서를 정리한 뒤 Graphify로 그래프를 빌드.

시작 시 대상 폴더·지식폴더 이름을 사용자에게 한 번 확인한다 (프로젝트마다 다르므로).

## 왜 이 구조인가
보통의 AI 사용은 매 질문마다 원본을 다시 읽어 느리고 토큰이 낭비되며 지식이 안 쌓인다.
세 가지가 한 폴더에서 공존해 이를 해결한다.
- **LLM Wiki**(방법론, Karpathy): 원본을 재사용 가능한 노트로 정리. AI는 원본 대신 위키를 본다.
- **Graphify**(도구): 코퍼스를 지식 지도(`graph.json`) + 요약(`GRAPH_REPORT.md`)으로 분석.
- **Obsidian**(사람용 편집기): 같은 `.md`를 편집·시각화. AI 동작과 무관.

## 워크플로

### 1. 구조 생성
대상 안에 지식 폴더(=Obsidian 보관함)를 만들고 `raw/` `wiki/` 두 개를 둔다.
```
<project>/
├── CLAUDE.md            # 프로젝트 루트 가이드
└── <kb-folder>/         # Obsidian 보관함
    ├── CLAUDE.md        # 위키 운영 규칙
    ├── raw/             # 원본 (수정 금지)
    └── wiki/            # 가공 노트 + 인덱스(MOC)
```
`graphify-out/`은 나중에 자동 생성되므로 손으로 만들지 않는다.

### 2. 원본을 raw/로
원본(PDF/docx/슬라이드 등)을 마크다운으로 변환해 `raw/`에 둔다. 이미지/슬라이드 위주 PDF는
페이지를 렌더링해 시각적으로 읽어 텍스트 추출이 놓치는 내용까지 담는다. 이후 `raw/`는 읽기 전용으로
취급 — 원본은 수정하지 않고 가공본을 따로 만든다.

### 3. wiki/ 노트 작성
주제별로 한 노트씩, 각 노트 최상단에 frontmatter(title, tags, status, updated). 노트는
위키링크 `[[ ]]`로 연결(파일명 기준이라 폴더 이동에 안전). 시작점으로 `wiki/인덱스 (MOC).md`를
만들어 모든 노트를 링크. 사실 미확인 내용은 추측 말고 `status: review`로 표시하고 사용자에게 알림.

### 4. CLAUDE.md 작성
AI를 싸게 만드는 핵심. `references/claude-md-templates.md`의 템플릿을 붙여넣는다. 루트 CLAUDE.md의 핵심 규칙:
> 답하기 전 `graphify-out/GRAPH_REPORT.md`를 먼저 읽고, `graph.json`에서 관련 노드만 참조.
> 원본 전체를 grep/read 하지 않는다. 그래프가 없으면 `<kb-folder>/wiki/인덱스 (MOC).md`에서 시작.

### 5. Graphify 설치 & 빌드
Graphify는 사용자 머신에 설치돼야 한다(샌드박스 불가). 사용자에게 터미널 명령을 안내:
```bash
uv tool install graphifyy        # 권장 (또는 pipx install graphifyy)
graphify install
graphify --version               # 확인
```
그다음 **프로젝트 루트**에서, AI 어시스턴트 안에서:
```
/graphify ./<kb-folder> --obsidian
```
결과는 실행 위치 기준 `graphify-out/`에 생긴다 → 반드시 프로젝트 루트에서 실행.

### 6. 자동 작동
터미널에서 한 번: `graphify claude install`
→ CLAUDE.md에 규칙 + Glob/Grep 전 PreToolUse 훅 설치. (읽기 자동화이며 갱신은 별도)

### 7. 유지보수
작은 수정마다 돌리지 않는다(문서 추출은 토큰 소모). 노트를 여러 개 추가/큰 변경 후:
```
/graphify ./<kb-folder> --update     # 변경 파일만 재처리
```
자동화: `graphify hook install`(커밋 시) 또는 `/graphify ./<kb-folder> --watch`.
`graph.json`/`GRAPH_REPORT.md`는 손으로 편집하지 않는다(Graphify가 관리).

## 주의
- `/graphify`는 **프로젝트 루트에서** 실행 (kb-folder 안 X) — 안 그러면 `graphify-out/` 위치가 어긋남.
- 샌드박스에서는 Graphify를 대신 설치할 수 없음 → 명령을 안내하고 `graphify --version` 확인 요청.
- 기존에 수동으로 만든 graph가 있으면 `graphify-out/` 생성 후 보관/삭제해 단일 출처 유지.

## 참고 파일
- `references/claude-md-templates.md` — 루트/지식폴더 CLAUDE.md, 노트 frontmatter, 체크리스트.
