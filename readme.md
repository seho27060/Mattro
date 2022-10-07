# 🥄 맛트로 mattro 🍴

<div align="center">
<br />
    <img src ="https://velog.velcdn.com/images/jmlee9707/post/c465b90c-7703-4fe5-8bcd-d0756315e550/image.png" width="300px" />
    <h3></h3>
    <br />
    <h3> 리뷰 텍스트를 활용한 감성 분석 기반 지하철 노선별 맛집 추천 서비스 </h3>
    <p align="center">
<br />
<img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white"> <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/sass-CC6699?style=for-the-badge&logo=sass&logoColor=white">
<br/>
<img src="https://img.shields.io/badge/spring-6DB33F?style=for-the-badge&logo=spring&logoColor=white">
<img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
<img src="https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
<img src="https://img.shields.io/badge/java-007396?style=for-the-badge&logo=java&logoColor=white">
<br />
<img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
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
    ├── public                        # 이미지, 사운드 파일 관련
    ├── components                    # 컴포넌트
    │     └── layouts                 # 공통 레이아웃 관련
    ├── constants                     # typescript type 및 데이터 관련
    ├── pages
    │     ├── api                     # API 관련
    │     ├── game                    # 게임 페이지 관련
    │     │      └── ...
    │     ├── subway                  # 노션별 맛집 추천 페이지 관련
    │     │      └── ...
    │     ├── theme                   # 오늘의 맛집 추천 페이지 관련
    │     │      └── ...
    │     ├── index.tsx               # 메인페이지 관련
    │     ├── _app.tsx                # 각 페이지별 공통 부분 리펙토링
    │     └──  _document.tsx           # meta 태그 정의 및 전체 페이지 구조
    └── styles                        # 스타일 관련 파일 모음
          └── ...
```

<br />

### 백엔드 파일 구조 ( 아래 수정 좀.....)

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

### ERD 구조 (수정 좀)

<!-- ![erd](https://velog.velcdn.com/images/jmlee9707/post/37780a60-148c-41fd-ab48-169b46c3f9fd/image.png) -->

<br />

### 아키텍처 구조

![](https://velog.velcdn.com/images/jmlee9707/post/4600462d-5444-4c0d-9e6a-e5e595d3d366/image.png)

<br />

## 3. 📂 기능 구현

### 메인 페이지

<br />

<!-- ![](https://velog.velcdn.com/images/jmlee9707/post/1f4c67e2-aec8-45eb-b1e1-30580ff96ff7/image.gif) -->

- 메인 홈
![메인 홈](https://user-images.githubusercontent.com/76723987/194450120-8cb45f7e-3a17-48a3-9bce-0145a0113ae4.png)

- 네비게이션
![네비게이션](https://user-images.githubusercontent.com/76723987/194450310-851c578f-de1e-47f7-ae6b-6e280c66560c.png)

- 노선별 추천
![노선별 추천](https://user-images.githubusercontent.com/76723987/194450118-44fdb951-0c84-480f-a50e-9ca76eeb6de2.png)

- 노선별 추천 결과
![노선별 추천 결과](https://user-images.githubusercontent.com/76723987/194450117-f11d9d0f-5c41-4382-a7cb-13462f52f11d.png)

- 설문 추천 메인
![설문 추천 메인](https://user-images.githubusercontent.com/76723987/194450114-f4089523-07b0-402d-a6ec-febbbdb5b7b3.png)

- 추천을 위한 설문
![추천을 위한 설문](https://user-images.githubusercontent.com/76723987/194450122-f51383b2-3c0d-4568-8af0-564412680aa5.png)

- 설문 추천 결과
![설문 추천 결과](https://user-images.githubusercontent.com/76723987/194450125-3a938748-5238-4c6c-9849-0380183c5d2f.png)

- 게임 메인
![게임 메인](https://user-images.githubusercontent.com/76723987/194450129-b6395094-47fe-4d2f-bd7f-f32095f9533a.png)

- 게임 방 목록
![게임 방 목록](https://user-images.githubusercontent.com/76723987/194450132-9bead0f2-1e51-48d5-8bcd-7a2b55f47199.png)

- 개임 로비
![개임 로비](https://user-images.githubusercontent.com/76723987/194450136-7f4daf19-e27b-43bf-a652-68d309e96b57.png)

- 게임 준비
![게임 준비](https://user-images.githubusercontent.com/76723987/194450139-79d2f03d-3fd2-46dd-893f-73c3edf20c6e.png)

- 게임 중
![게임 중](https://user-images.githubusercontent.com/76723987/194450111-59ef177c-1268-40c9-863c-d9720c3162bd.png)

<br />

## 4. 📂 프로젝트 소개 영상

<br />

<!-- [![](http://img.youtube.com/vi/798nNJ66RFU/0.jpg)](https://youtu.be/798nNJ66RFU) -->

<br />

## 5. 📂 프로젝트 관련 문서

<br />

[🎨 프로토타입, 디자인 ](https://www.figma.com/file/2WPMVpI0FjHivppKe7t67q/prototype?node-id=0%3A1)

[📡 요구사항 명세서](https://scratch-octopus-16f.notion.site/3bd0fbca4e6b4e5e92b4495b8826553d)

[📋 API 명세서](https://scratch-octopus-16f.notion.site/API-942660d4336942d7a7bf1aefac93c28f)

![](https://velog.velcdn.com/images/jmlee9707/post/6a9c5972-15db-4e4e-ab14-f9a3f8ed3e79/image.png)
