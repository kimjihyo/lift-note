# Claude Code 메모

## 프로젝트 정보

### 패키지 매니저
- **pnpm** 사용
- 모든 패키지 설치 및 스크립트 실행 시 pnpm 사용할 것

### 기술 스택
- Next.js 16.1.0 (App Router)
- React 19.2.3
- TypeScript 5
- TailwindCSS v4
- shadcn/ui
  - Button, Calendar, Dialog, Badge 컴포넌트
  - date-fns, react-day-picker (Calendar 의존성)
  - lucide-react (아이콘)

### 프로젝트 개요
운동 기록 관리 웹 앱 (lift-memo)
- 날짜 중심 UX
- 모바일 First UI
- 로컬 스토리지 기반 데이터 저장

### 주요 기능
1. 달력 페이지 (메인 진입점)
2. 운동 기록 추가/수정 페이지
3. 운동 종목 및 세트 관리
4. 태그 시스템 (가슴/등/어깨/하체/팔)

### 데이터 모델 (README.md 참조)
```typescript
type WorkoutSet = {
  id: string;
  weight: number;  // kg
  reps: number;    // 반복 횟수
};

type Exercise = {
  id: string;
  name: string;
  sets: WorkoutSet[];
};

type WorkoutRecord = {
  date: string; // YYYY-MM-DD
  tags: ("가슴" | "등" | "어깨" | "하체" | "팔")[];
  exercises: Exercise[];
};
```

### 라우팅 구조
- `/` - 달력 페이지 (메인)
- `/workout/[date]` - 운동 기록 페이지 (동적 라우팅)

### 프로젝트 구조
```
/app
  /layout.tsx
  /page.tsx (달력 페이지)
  /globals.css (TailwindCSS + shadcn/ui 테마)
  /workout/[date]/page.tsx (운동 기록 페이지)
/components
  /ui/ (shadcn/ui 컴포넌트)
/lib
  /utils.ts (cn 유틸 함수)
```

### 개발 진행 상황
- [x] Next.js 프로젝트 초기화
- [x] TailwindCSS v4 설정
- [x] shadcn/ui 설정 완료
  - components.json 설정
  - Button, Calendar, Dialog, Badge 컴포넌트 설치
  - 필수 의존성: class-variance-authority, clsx, tailwind-merge, lucide-react
  - lib/utils.ts 생성 (cn 유틸 함수)
  - app/globals.css에 shadcn/ui 테마 변수 추가 (다크모드 지원)
- [ ] TypeScript 데이터 모델 정의
- [ ] 달력 페이지 구현
- [ ] 운동 기록 페이지 구현
- [ ] 컴포넌트 구현

## 중요 규칙

### 파일명 및 컴포넌트 구조
- **모든 파일명은 kebab-case 사용** (예: `workout-calendar.tsx`, `exercise-form.tsx`)
- **page.tsx는 항상 서버 컴포넌트로 유지**
- 클라이언트 컴포넌트가 필요한 경우:
  - 하위 자식 컴포넌트로 분리
  - 재사용되지 않는 컴포넌트: 해당 페이지 디렉토리에 `_components/` 생성
    - 예: `app/workout/[date]/_components/exercise-form.tsx`
  - 재사용되는 컴포넌트: `/components/` 디렉토리에 배치

### Git 커밋
- 커밋 메시지에 "🤖 Generated with Claude Code" 및 "Co-Authored-By" 추가하지 않기
- 의미 있는 단위로 커밋 생성
- 작업 완료 시마다 커밋 후 보고

### 커밋 메시지 스타일
- 기존 커밋 참고:
  - `docs: README에 PRD(product requirements document) 초안 작성`
  - `feat: ...`
  - `chore: ...` (개발 환경 설정)
  - 간결하고 명확하게

### 개발 워크플로우
1. TODO 항목 작업 시작 → in_progress로 변경
2. 작업 완료 → completed로 변경 & 즉시 커밋
3. 사용자에게 진행 상황 보고

## 참고사항
- 상세 기획은 README.md 참조
- 모든 커맨드는 pnpm 사용
- tsconfig.json의 path alias: `@/*` → 프로젝트 루트
