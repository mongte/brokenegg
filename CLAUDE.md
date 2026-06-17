# CLAUDE.md — 프로젝트 가이드

이 저장소는 홈페이지 프로젝트입니다.

## 지식 위키 (중요) — LLM Wiki + Graphify
- `brokenegg-doc/` 폴더가 이 프로젝트의 **지식 단일 출처(Single Source of Truth)**입니다.
- 지식 지도는 **Graphify**가 생성/유지합니다. 결과물은 `graphify-out/`에 있습니다.

### 질문에 답하기 전 (토큰 절약)
1. `graphify-out/GRAPH_REPORT.md`(갓 노드·커뮤니티·추천 질문 요약)를 먼저 읽는다.
2. 더 깊은 탐색이 필요하면 `graphify query "<질문>"` 또는 `graphify-out/graph.json`을 사용한다.
3. **원본 파일 전체를 매번 grep/read 하지 않는다.** 그래프로 먼저 탐색한다.
> 위 규칙과 PreToolUse 훅은 `graphify claude install`로 자동 설치됩니다. (아래 "운영" 참고)

### 그래프가 아직 없을 때 (graphify 미설치/미실행 상태)
- `brokenegg-doc/wiki/인덱스 (MOC).md`를 시작점으로 사용하고, 위키링크를 따라 관련 노트만 읽는다.

## 운영 (Graphify)
- 최초 빌드: `cd ~/github/brokenegg && /graphify ./brokenegg-doc --obsidian`
- 자동 작동: `graphify claude install` (CLAUDE.md 섹션 + PreToolUse 훅)
- 자료 갱신: `/graphify ./brokenegg-doc --update` (또는 `graphify hook install`로 커밋 시 자동)

## 작업 원칙
- 홈페이지 카피/문구는 `brokenegg-doc/wiki/`의 카피 노트를 기준으로 사용합니다.
- 위키에 없는 사실은 추측하지 말고, 사용자에게 확인하거나 `brokenegg-doc/`에 `status: review`로 추가합니다.
