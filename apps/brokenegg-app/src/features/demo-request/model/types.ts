/** 데모 요청 폼이 수집하는 입력값. 모달 상태와 API 페이로드가 공유한다. */
export interface DemoRequestForm {
  company: string;
  name: string;
  contact: string;
  email: string;
  message: string;
}

/** 서버로 전송되는 요청 본문. 사용자 입력 + 봇 차단용 허니팟. */
export interface DemoRequestPayload extends DemoRequestForm {
  /** 화면에 숨겨진 허니팟. 값이 있으면 봇으로 간주. */
  botcheck?: string;
}

/** /api/demo-request 응답 형태. */
export interface DemoRequestResponse {
  ok: boolean;
  error?: string;
}

/** 빈 폼 초기값. */
export const EMPTY_FORM: DemoRequestForm = {
  company: '',
  name: '',
  contact: '',
  email: '',
  message: '',
};
