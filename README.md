### 🙌 모노레포 연습 리파지토리 입니다.

- 모노레포 사용법을 연습 합니다.
- 모듈 형식으로 프로젝트가 구성되어 있습니다.
- 서버 : nestjs
- 클라이언트 : nextjs(react)

---

### ❓프로젝트 구조

```js
 apps : 프로젝트들이 모여있는 가장 루트 디렉토리
  - server : nestjs로 구성된 프로젝트
  - client : nextjs로 구성된 프로젝트
 packages : 사용자가 정의한 각종 라이브러리, 각각 프로젝트들이 공유하려는 라이브러리
  - common-props : 각종 상수 모임
  - common-utils : 각종 사용자 공통 유틸 모임
```

---

### 🙋‍♀️최상단 package.json 구조

```js
1. name : 루트 패키지 이름
2. workspaces : 작업 공간, 프로젝트와 라이브러리의 디렉토리 위치를 같이 명시 합니다.
3. type : module 을 사용함으로써 import와 export 문법을 적용 합니다.
```

---

### 🛠 구성시 주의 사항

1. 각각의 package.json에 버전과 이름을 겹치지 않도록 꼭 주의해야 합니다.
2. 라이브러리를 보관하는 packages 디렉토리에서 package.json의 name 값은 import 할 때 사용 됩니다.
3. 프로젝트별, 라이브러리별 package.json이 있는 곳 에서 yarn, npm 같은 명령어를 통해 install이 가능 합니다.
