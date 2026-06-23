/** 모든 "데모 요청" CTA가 공유하는 모달 열기 신호. */
export const DEMO_MODAL_OPEN_EVENT = 'brokenegg:open-demo';

/** 데모 요청 모달을 연다. 어느 컴포넌트에서든 호출 가능. */
export function openDemoModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(DEMO_MODAL_OPEN_EVENT));
  }
}
