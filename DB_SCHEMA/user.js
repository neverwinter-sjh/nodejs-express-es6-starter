// Collection: USER
const USER = {
  user_id: 'test1', // Required
  password: 'password', // Required
  user_email: 'test@naver.com', // Required
  phone_number: '010-1234-1234', // 핸드폰 번호
  user_nickname: '아이유러브', // 유저 닉 네임
  country_code: 'KR', // 국가 코드
  birth_day: '19950502', // 생일
  hr_member_flag: 'false', // 한류지기 여부
  user_photo: '', // 유저 사진
  friends: [
    // 친구 목록
    {
      user_id: 'iu_love',
      fc_ids: ['iu_1', 'nct_2']
    }
  ],
  fanclubs: [
    // 가입한 팬클럽
    {
      fc_code: 'iu_1',
      fc_member_level: '2', // 1: 주인, 2: 운영진, 3: 멤버
      fc_joining_date: '2019-07-15 12:23:00', // 가입날짜
      fc_joining_status: 'running', // running:활동중, pause:휴면, stop:정지, withdrawl:탈퇴
      fc_withdrawal_date: '2019-07-15 12:23:00', // 탈퇴 일자
      fc_pause_date: '2019-07-16 15:22:22', // 정지 일자
      fc_rejoin_date: '2019-07-17 16:44:44' // 재시작일자
    },
    {
      fc_code: 'nct_2',
      fc_member_level: '1',
      fc_joining_date: '2019-07-15 12:23:00',
      fc_joining_status: '활동중', // 활동중, 휴면, 정지, 탈퇴
      fc_withdrawal_date: '2019-07-15 12:23:00', // 탈퇴 일자
      fc_pause_date: '2019-07-16 15:22:22', // 정지 일자
      fc_rejoin_date: '2019-07-17 16:44:44' // 재시작일자
    }
  ],
  star_name_wishlist: ['NCT128', '방탄 정국'] // 신청한 아티스트 이름
};
