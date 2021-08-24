#ERD 링크
URL : https://aquerytool.com/aquerymain/index/?rurl=92722557-f92e-4887-88f6-0eb583001f02&
Password : 1t27pd

#개발일지

## 2021-07-31 진행상황
- RDS 데이터베이스 구축 -risingTest
- EC2 인스턴스 구축
- test/product 서브도메인 설정
- SSL 인증 적용 (메인 도메인, 서브 도메인 각각 적용)
- test API 작성 - 서버 정상 작동 확인을 위함

## 2021-08-01 진행상황
- Coupang Eats ERD 설계 완료 
  <aquerytool 링크>
  URL : https://aquerytool.com/aquerymain/index/?rurl=92722557-f92e-4887-88f6-0eb583001f02&
  Password : 1t27pd
- DB 연결 이슈 해결
- 예시 데이터 작업 진행중 
  3495개의 행정구역 데이터 삽입 실패 / datagrip에서 최대 500개의 row만 허용
  425개의 서울시 데이터만을 삽입하기로 함

## 2021-08-02 진행상황
- ERD 수정, 테이블 추가 및 컬럼 수정
- 더미 데이터 작업 진행중
- 쿼리 작성
- 회원가입 API 완성
- 로그인 API 완성

## 2021-08-03 진행상황
- ERD 수정, 테이블 추가 및 컬럼 수정
- 서브 도메인 이슈 해결
- api 리스트업
- 홈화면 api 작업 진행중 

## 2021-08-04 진행상황
- ERD 수정, 테이블 추가 및 컬럼 수정
- 홈화면 api 작성
- 식당 조회 api 작성
- 쿼리 작성

## 2021-08-05 진행상황
- API 작성 중(식당 메뉴창 api, 쿼리 스트링이 필요한 식당 필터링 api들)
- 쿼리 작성 문제로 시간을 많이 소비하여 내일 중으로 해결할 예정

## 2021-08-06 진행상황
- 다중 조건 필터링 기능 구현
- 서버 구분 문제 해결
- 골라먹는 맛집 API 완성
- 인기 프랜차이즈 API 완성
- 새로 들어왔어요 API 완성
- 식당 메뉴창 API 완성
- 식당 세부 정보 조회 API 완성
- 특정 메뉴 조회 API 완성
- 전국 행정구역 주소 더미테이터 생성 (서울 -> 전국)

## 2021-08-07 진행상황
- 카트 담기 API 완성
- 9번 API까지 명세서 업데이트
- 카트 보기 쿼리 작성중

## 2021-08-08 진행상황
- 홈화면 API 나누기 - 유저 기본 주소정보, 이벤트 배너, 식당 카테고리, 식당 리스트
- 카트 보기 API 완성
- 배달지 주소 설정 API 완성
- 카트 요청사항 수정 API 완성

## 2021-08-08 진행상황
- 리뷰 조회 API 완성
- API 피드백 반영 작업

## 2021-08-09 진행상황
- 카트 담기 API 수정 
- 카트 생성 API 추가 
- 카트 보기 API 수정 
- 홈화면 API 통합 및 수정 
- jwt 추가 // userId 있는 api // 3,7,10 
- 카트 담기, 카트 존재에 대한 validation 추가 
- 결제하기 API 수정
- Order테이블에 컬럼 추가, Cart에서는 삭제
  reqManager
  reqDelivery
  disposableCheck
  userCouponId
  totalPayPrice
  
  
## 2021-08-10 진행상황
- 카트 생성과 카트 담기로 나눔
- 홈화면 API 다시 합침
- api 전체 검토하여 result 객체 안 배열들 마다 구분을 위해서 배열명을 부여
- user정보를 담아서 사용하는 경우 jwt 추가
- 결제하기 API 수정
- 리뷰 조회 API 완성

## 2021-08-11 진행상황
- 홈화면 API 수정
- 식당 메뉴창 API 수정
- 인근 지역만 불러오도록 DAO 파일 수정
- 리뷰 평가하기 API 완성
- 리뷰 작성 API 완성
- 더미데이터 작업

## 2021-08-12 진행상황
- 식당 리스트 조회 시 랜덤 인덱스로 랜덤하게 불러오도록 쿼리 수정
- 배달지 추가 api 완성
- 배달지 수정 api 완성
- 즐겨찾기 등록 api 완성
- 즐겨찾기 조회 api 완성
- API 수정 작업
## 2021-08-13 진행상황
- 검색 + 검색기록 저장 API 완성
- 인기 검색어 API 완성
- 최근 검색어 API 완성
- 주문내역 API 완성
- 더미 데이터 작업

## ✨License
- 본 템플릿의 소유권은 소프트스퀘어드에 있습니다. 본 자료에 대한 상업적 이용 및 무단 복제, 배포 및 변경을 원칙적으로 금지하며 이를 위반할 때에는 형사처벌을 받을 수 있습니다.

  
