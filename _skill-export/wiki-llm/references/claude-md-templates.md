# CLAUDE.md & Note Templates

Paste-ready templates. Replace `<kb-folder>` with the actual knowledge folder
name (e.g. `docs`, `brokenegg-doc`, `knowledge`).

---

## Project-root CLAUDE.md

```markdown
# CLAUDE.md — 프로젝트 가이드

## 지식 위키 (중요) — LLM Wiki + Graphify
- `<kb-folder>/` 폴더가 이 프로젝트의 지식 단일 출처(Single Source of Truth)입니다.
- 지식 지도는 Graphify가 생성/유지합니다. 결과물은 `graphify-out/`에 있습니다.

### 질문에 답하기 전 (토큰 절약)
1. `graphify-out/GRAPH_REPORT.md`(요약)를 먼저 읽는다.
2. 더 깊은 탐색은 `graphify query "<질문>"` 또는 `graphify-out/graph.json`을 사용한다.
3. 원본 파일 전체를 매번 grep/read 하지 않는다. 그래프로 먼저 탐색한다.

### 그래프가 아직 없을 때
- `<kb-folder>/wiki/인덱스 (MOC).md`를 시작점으로, 위키링크를 따라 관련 노트만 읽는다.

## 운영 (Graphify)
- 최초 빌드: `cd <project> && /graphify ./<kb-folder> --obsidian`
- 자동 작동: `graphify claude install` (CLAUDE.md 섹션 + PreToolUse 훅)
- 자료 갱신: `/graphify ./<kb-folder> --update`

## 작업 원칙
- 위키에 없는 사실은 추측하지 말고, 사용자에게 확인하거나 `status: review`로 추가합니다.
```

---

## Knowledge-folder CLAUDE.md (`<kb-folder>/CLAUDE.md`)

```markdown
# CLAUDE.md — <kb-folder> (LLM Wiki)

이 폴더는 지식 위키이자 Obsidian 보관함입니다. LLM Wiki + Graphify 방식으로 운영합니다.

## 질문에 답하기 전 (가장 중요)
1. `../graphify-out/GRAPH_REPORT.md`를 먼저 읽는다.
2. 더 깊은 탐색은 `graphify query "<질문>"` 또는 `../graphify-out/graph.json`.
3. 원본(`raw/`)과 전체 노트를 처음부터 다 읽지 않는다. 그래프로 먼저 탐색한다.
4. 답변 시 관계 신뢰도를 구분 (EXTRACTED=확실 / INFERRED=추론 / AMBIGUOUS=검토).
> graph가 없으면 `wiki/인덱스 (MOC).md`를 시작점으로 위키링크를 따른다.

## 폴더 구조 (raw + wiki)
- `raw/`  : 변환된 원본 자료. 수정 금지.
- `wiki/` : 가공한 지식 노트 + 인덱스(MOC).
- `../graphify-out/` : Graphify 생성물. 손으로 편집 금지.

## 새 자료가 들어오면
1. 새 원본을 읽고 관련 `wiki/` 노트를 업데이트하거나 새로 만든다.
2. `wiki/인덱스 (MOC).md`에 위키링크 추가.
3. 변경 노트의 frontmatter `updated` 갱신.
4. 지도 갱신은 `/graphify ./<kb-folder> --update`에 위임 (수동 편집 금지).

## 노트 작성 규칙
- 모든 노트 최상단 frontmatter (title, tags, status, updated).
- 노트 간 연결은 위키링크 `[[노트제목]]`.
- 한 노트 = 한 주제. 미확인 내용은 `status: review`.
```

---

## Note frontmatter template

```markdown
---
title: 노트 제목
tags: [주제, 상태]
status: draft | review | done
updated: YYYY-MM-DD
---

# 노트 제목

내용...

관련: [[다른 노트]]
```

---

## New-project checklist

1. [ ] `<kb-folder>/` 생성 (Obsidian 보관함), 안에 `raw/` `wiki/`
2. [ ] 원본 → 마크다운 변환해 `raw/`에 보관
3. [ ] `raw/` 가공해 `wiki/` 노트 작성 + `wiki/인덱스 (MOC).md`
4. [ ] 루트 + `<kb-folder>` CLAUDE.md 작성
5. [ ] `uv tool install graphifyy && graphify install`
6. [ ] 루트에서 `/graphify ./<kb-folder> --obsidian`
7. [ ] `graphify claude install`
8. [ ] 자료 변경 시 `/graphify ./<kb-folder> --update`
```
