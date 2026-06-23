/** 조건부 className 합치기. falsy(undefined/false/null/'')는 무시. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
