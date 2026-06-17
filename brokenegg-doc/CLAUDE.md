# CLAUDE.md — brokenegg-doc (LLM Wiki)

이 폴더는 브로큰에그 프로젝트의 지식 위키이자 Obsidian 보관함입니다.
**LLM Wiki + Graphify** 방식으로 운영합니다. 토큰을 아끼기 위해, 원본 전체를 매번 읽지 않고 지식 지도를 먼저 봅니다.

## ⭐ 질문에 답하기 전 (가장 중요)
1. 먼저 `../graphify-out/GRAPH_REPORT.md`(Graphify가 생성한 요약)를 읽는다.
2. 더 깊은 탐색은 `graphify query "<질문>"` 또는 `../graphify-out/graph.json`을 사용한다.
3. **원본(`raw/`)과 전체 노트를 처음부터 다 읽지 않는다.** 그래프로 먼저 탐색한다.
4. 답변할 때 관계의 신뢰도를 구분해 말한다 (EXTRACTED=확실 / INFERRED=추론 / AMBIGUOUS=검토 필요).

> graph가 아직 없으면 `wiki/인덱스 (MOC).md`를 시작점으로, 위키링크를 따라 관련 노트만 읽는다.
> 그래프 빌드/갱신은 루트 CLAUDE.md의 "운영(Graphify)" 참고.

## 폴더 구조 (raw + wiki)
- `raw/`  : 변환된 원본 자료(PDF→md 등). **수정 금지.**
- `wiki/` : 원본을 가공한 지식 노트 + 색인(`인덱스 (MOC).md`).
- `../graphify-out/` : Graphify가 생성한 지식 지도(GRAPH_REPORT.md, graph.json, graph.html). **손으로 편집 금지.**

## 새 자료가 들어오면 (위키 갱신 규칙)
새 파일이 `raw/`에 추가되면 다음을 수행한다.
1. 새 원본을 읽고, 관련된 기존 `wiki/` 노트를 **업데이트**하거나 새 노트를 만든다.
2. `wiki/인덱스 (MOC).md`에 위키링크를 추가한다.
3. 변경 노트의 frontmatter `updated`를 갱신한다.
4. **지식 지도 갱신은 Graphify에 맡긴다**: `/graphify ./brokenegg-doc --update` (변경 파일만 재처리).
   - `graph.json`/`GRAPH_REPORT.md`를 직접 손으로 편집하지 않는다. Graphify가 관리한다.

## 노트 작성 규칙
- 모든 노트 최상단 frontmatter:
  ```
  ---
  title: 노트 제목
  tags: [주제, 상태]
  status: draft | review | done
  updated: YYYY-MM-DD
  ---
  ```
- 노트 간 연결은 위키링크 `[[노트제목]]`.
- 한 노트 = 한 주제. 사실 미확인 내용은 추측하지 말고 `status: review`로 표시.
