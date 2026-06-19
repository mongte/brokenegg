/** UseCaseRow가 매핑하는 lucide 아이콘 키. */
export type UseCaseIcon =
  | 'users'
  | 'trending-up'
  | 'rss'
  | 'monitor'
  | 'message-circle';

export interface UseCase {
  id: string;
  title: string;
  icon: UseCaseIcon;
  /** 본문 문단들 (한 항목에 여러 문단). */
  body: string[];
}
