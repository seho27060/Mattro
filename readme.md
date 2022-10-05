# 🥄 맛트로 mattro 🍴

<div align="center">
<br />
    <img src ="https://velog.velcdn.com/images/jmlee9707/post/c465b90c-7703-4fe5-8bcd-d0756315e550/image.png" width="300px" />
    <h3></h3>
    <br />
    <h3> 리뷰 텍스트를 활용한 감성 분석 기반 지하철 노선별 맛집 추천 서비스 </h3>
    <p align="center">
<br />
<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
<img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=white">
<br/>
<img src="https://img.shields.io/badge/redux toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white">
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white">
<br />
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/apache tomcat-F8DC75?style=for-the-badge&logo=apachetomcat&logoColor=white"> 
<img src="https://img.shields.io/badge/gitlab-FC6D26?style=for-the-badge&logo=gitlab&logoColor=white">
<img src="https://img.shields.io/badge/jirasoftware-0052CC?style=for-the-badge&logo=jirasoftware&logoColor=white">
<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
<br />

</p>
</div>
<br />

<!-- ## 🍴 배포 주소 -->

<!-- ## 🍴 데모 영상 -->

## 🍴 팀원 소개

```
삼성 청년 SW 7기 광주 2반 특화 프로젝트 C206 - 당근
```

| [조성민](https://github.com/jmlee9707) | [박상현](https://github.com/4d656f77) | [박세호](https://github.com/Hanpark04) | [염진호](https://github.com/Dongmyeongleee) |        [윤정원]()        |                                              [이정민](https://github.com/ammajoe)                                               |
| :------------------------------------: | :-----------------------------------: | :------------------------------------: | :-----------------------------------------: | :----------------------: | :-----------------------------------------------------------------------------------------------------------------------------: |
|       <img src="" width="100"/>        |      <img src="" width ="100"/>       |       <img src="" width ="100"/>       |         <img src="" width ="100"/>          | <img src="" width="100"> | <img src="https://user-images.githubusercontent.com/72871348/169957444-3e3a7ad7-d0fe-4a0a-9061-d7546aaae495.jpg" width ="100"/> |
|                   BE                   |                  BE                   |                   BE                   |                     FE                      |            FE            |                                                               FE                                                                |

<br />
<br />

## 🍴 프로젝트 소개

- CAMPIC은 캠핑 일정 관리와 캠핑장 맞춤별 검색 기능을 바탕으로 커뮤니티 기능을 통해서 간편한 캠핑 계획 설정과 다른 사용자 간의 소통이 가능한 웹 서비스입니다.
- 캠핑 일정 관리를 할 수 있고, 가고 싶은 캠핑장을 담아 둘 수 있습니다.
- 태그별, 지역별, 거리별 캠핑장 검색 기능을 통해서 사용자에게 적합한 캠핑장을 선택할 수 있습니다.
- 베스트 PHOTO와 베스트 TALK을 통해서 추천하고 싶은 캠핑장과 추억들을 받아볼 수 있습니다.

<br />
<br />

## 1. 📂 파일구조

<br />

### 프론트 파일 구조

<br />

```text
  root
    ├── public
    ├── src
    │     ├── apis                    # API 관련
    │     ├── assets                  # 미디어 파일들
    │     │      ├── images           # 이미지 파일 관련
    │     │      └── styles           # 폰트,색상
    │     │             └── fonts
    │     ├── components              # 컴포넌트
    │     │      └── common           # (공통,페이지별)
    │     ├── routers                 # 라우팅
    │     ├── utils                   # 유틸함수
    │     ├── screens                 # 페이지별
    │     └── store                   # 상태관리
    └── dist                          # 빌드 파일
          └── ...
```

<br />

### 백엔드 파일 구조

<br />

```text
.
└─src
    └─main
         ├─java
         │  └─com
         │      └─web
         │          └─curation
         │              ├─config           # Spring Config 파일
         │              ├─controller       # Http 요청과 응답을 위한 클래스
         |	            ├─data
         |              |   ├─dto          # 데이터 전송 객체
         |              |   ├─entity       # JPA에서 사용할 엔티티
         |              |   └─repository   # DB에 접근하는 Interface
         │              ├─exception        # 예외처리
         │              └─service          # Repository와 DTO를 통해 DB와 controller 연결
         |
         └─resources                       # application 필요한 옵션 지정

```

<br />
<br />

## 2. 📂 백엔드 구조

<br />

### ERD 구조

![erd](https://velog.velcdn.com/images/jmlee9707/post/37780a60-148c-41fd-ab48-169b46c3f9fd/image.png)

<br />

### 아키텍처 구조

![](https://velog.velcdn.com/images/jmlee9707/post/f88736d6-3d29-44c5-8698-484a382afc58/image.png)

<br />

## 3. 📂 기능 구현

### 메인 페이지

<br />

![](https://velog.velcdn.com/images/jmlee9707/post/1f4c67e2-aec8-45eb-b1e1-30580ff96ff7/image.gif)

- 캠픽 서비스 소개 페이지
- 현재 위치에 따른 날씨 정보 받기

<br />

### 회원가입/로그인

<br />

![](https://velog.velcdn.com/images/jmlee9707/post/7680c5f8-f321-4d95-9729-dc52408d1ccc/image.png)

- 이메일 인증 회원가입
- 소셜 로그인/회원가입
- 아이디 찾기
- 비밀번호 초기화 후 등록
- 로그아웃

<br />

### 캠핑장 페이지

<br />

![](https://velog.velcdn.com/images/jmlee9707/post/0d2152d6-f044-4656-a039-13a6e5c5b36a/image.gif)

- 캠핑장 검색
- 태그별 캠핑장 검색
- 지역별 캠핑장 검색

![](https://velog.velcdn.com/images/jmlee9707/post/c892230c-53d8-4e81-8d39-11174a3c2edb/image.gif)

- 가고 싶은 캠핑장을 계획에 추가 하기
- 선택한 캠핑장 상세 정보 보기
- 선택한 캠핑장 사이트로 가기

<br />

### 계획하기

<br />

![](https://velog.velcdn.com/images/jmlee9707/post/295d6324-6f9d-4a02-adbb-b9c99de7320e/image.png)

![](https://velog.velcdn.com/images/jmlee9707/post/a799bb2b-8555-4224-be4d-68a42d8c631b/image.gif)

- 캠핑장 리스트에서 추가한 캠핑 계획 리스트
- 지난 캠핑 계획 리스트
- 상세 페이지에서 캠핑장 상세정보 확인 가능, To-do List 작성

<br />

### 커뮤니티 메인

![](https://velog.velcdn.com/images/jmlee9707/post/6bec939f-0df8-4cb5-9418-5cac519b2754/image.gif)
<br />

- 일정 기간 받은 좋아요 수를 기준으로 best talk 6개, best photo 8개를 나열

<br />

### 커뮤니티 -> PHOTO 게시판

<br />

- best photo 8개와 함께 최신순으로 photo 게시글 나열, 무한스크롤 구현
- 사진 등록과 설명, 태그 작성 기능
- CRUD 구현
- 좋아요 기능

<br />

### 커뮤니티 -> TALK 게시판

<br />

- best talk 6개와 함께 최신순으로 photo 게시글 나열, 무한스크롤 구현
- 사진과 태그 등을 활용한 노하우 게시글 등록 기능
- CRUD 구현
- 상세페이지 좋아요 기능
- 댓글 작성 기능

<br />

### 준비물

<br />

![](https://velog.velcdn.com/images/jmlee9707/post/22bee5ca-cdfc-4999-8449-89356008347d/image.gif)

- 캠핑준비물 검색 페이지
- 네이버 쇼핑api를 활용해서 원하는 키워드 입력 시 리스트 출력
- 검색어를 db에 저장하여 인기순 정렬 후 출력

<br />

### 마이페이지

<br />

![](https://velog.velcdn.com/images/jmlee9707/post/474713f7-82bd-4bf8-9e5e-2354a2506f12/image.png)

![](https://velog.velcdn.com/images/jmlee9707/post/d449b544-0547-4435-ab12-87b65aca434b/image.png)

- 내가 쓴 talk / photo 리스트
- 프로필 수정 기능
- 개인정보 수정 기능
- 비밀번호 변경 기능
- 회원 탈퇴 기능

<br/>
<br />
<br />

## 4. 📂 프로젝트 소개 영상

<br />

[![](http://img.youtube.com/vi/798nNJ66RFU/0.jpg)](https://youtu.be/798nNJ66RFU)

<br />

## 5. 📂 프로젝트 관련 문서

<br />

[🎨 프로토타입, 디자인 ](https://scratch-octopus-16f.notion.site/UI-3412085ccd92446eb123a0db28ba86d2)

[📃 회의록 & 스크럼](https://scratch-octopus-16f.notion.site/09c08675b93242c28e174a6aba5261e4?v=dea8006efd4940c2a38a8c4de45d9768)

[📡 요구사항 명세서](https://scratch-octopus-16f.notion.site/3bd0fbca4e6b4e5e92b4495b8826553d)

[📋 API 명세서](https://scratch-octopus-16f.notion.site/API-fbee3ab9f0d046fbb18d67d84e961731)
