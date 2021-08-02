module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_PASSWORD_EMPTY: { "isSuccess": false, "code": 2002, "message":"비밀번호를 입력해주세요" },
    SIGNUP_PHONENUMBER_EMPTY: { "isSuccess": false, "code": 2003, "message":"전화번호를 입력해주세요" },
    SIGNUP_USERNAME_EMPTY: { "isSuccess": false, "code": 2004, "message":"유저이름을 입력해주세요" },
    SIGNUP_PHONENUMBER_LENGTH: { "isSuccess": false, "code": 2005, "message":"전화번호 11자리를 입력해주세요" },
    SIGNUP_USERNAME_LENGTH: { "isSuccess": false, "code": 2006, "message":"실명을 입력해주세요.(성 제외 5글자 이하)" },
    SIGNUP_PASSWORD_LENGTH: { "isSuccess": false, "code": 2007, "message":"비밀번호는 8~20자리로 입력해주세요" },
    SIGNUP_PHONENUMBER_NOTNUM: { "isSuccess": false, "code": 2008, "message":"전화번호는 숫자만 입력해주세요" },
    SIGNUP_EMAIL_ERROR_TYPE: { "isSuccess": false, "code": 2009, "message":"이메일 형식에 맞게 입력해주세요" },

    SIGNIN_USEREMAIL_EMPTY: { "isSuccess": false, "code": 2010, "message":"이메일을 입력해주세요" },
    SIGNIN_PASSWORD_EMPTY: { "isSuccess": false, "code": 2011, "message":"비밀번호를 입력해주세요" },
    SIGNIN_PASSWORD_LENGTH: { "isSuccess": false, "code": 2012, "message":"비밀번호는 8~20자리로 입력해주세요" },
    SIGNIN_EMAIL_ERROR_TYPE: { "isSuccess": false, "code": 2013, "message":"이메일 형식에 맞게 입력해주세요" },


    // Response error
    SIGNUP_REDUNDANT_PHONENUMBER : { "isSuccess": false, "code": 3001, "message":"중복된 전화번호입니다." },
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3002, "message":"중복된 이메일입니다." },

    SIGNIN_USEREMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },


    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},


}
