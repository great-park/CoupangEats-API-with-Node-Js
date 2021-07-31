module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_EMAIL_EMPTY : { "isSuccess": false, "code": 2001, "message":"이메일을 입력해주세요" },
    SIGNUP_EMAIL_LENGTH : { "isSuccess": false, "code": 2002, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNUP_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNUP_PASSWORD_EMPTY : { "isSuccess": false, "code": 2004, "message": "비밀번호를 입력 해주세요." },
    SIGNUP_PASSWORD_LENGTH : { "isSuccess": false, "code": 2005, "message":"비밀번호는 6~20자리를 입력해주세요." },

    SIGNUP_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2001, "message":"전화번호를 입력해주세요" },
    SIGNUP_PHONENUMBER_LENGTH : { "isSuccess": false, "code": 2002, "message":"전화번호는 11자리입니다." },
    SIGNUP_PHONENUMBER_NOTNUM : { "isSuccess": false, "code": 2020, "message":"숫자를 입력해주세요." },
    SIGNUP_TOWNNAME_EMPTY : { "isSuccess": false, "code": 2040, "message": "동네를 입력 해주세요." },
    SIGNUP_UESRNAME_EMPTY : { "isSuccess": false, "code": 2006, "message":"닉네임을 입력 해주세요." },
    SIGNUP_USERNAME_LENGTH : { "isSuccess": false,"code": 2007,"message":"닉네임은 최대 20자리를 입력해주세요." },

    SIGNIN_PHONENUMBER_EMPTY : { "isSuccess": false, "code": 2008, "message":"전화번호를 입력해주세요" },
    SIGNIN_PHONENUMBER_LENGTH : { "isSuccess": false, "code": 2009, "message":"전화번호는 11자리 입니다." },
    SIGNIN_PHONENUMBER_NOTNUM : { "isSuccess": false, "code": 2021, "message":"숫자를 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },


    SIGNIN_EMAIL_EMPTY : { "isSuccess": false, "code": 2008, "message":"이메일을 입력해주세요" },
    SIGNIN_EMAIL_LENGTH : { "isSuccess": false, "code": 2009, "message":"이메일은 30자리 미만으로 입력해주세요." },
    SIGNIN_EMAIL_ERROR_TYPE : { "isSuccess": false, "code": 2010, "message":"이메일을 형식을 정확하게 입력해주세요." },
    SIGNIN_PASSWORD_EMPTY : { "isSuccess": false, "code": 2011, "message": "비밀번호를 입력 해주세요." },

    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },
    USER_USERNAME_EMPTY: { "isSuccess": false, "code": 2030, "message": "userName를 입력해주세요." },
    USER_USERID_NOT_EXIST : { "isSuccess": false, "code": 2013, "message": "해당 회원이 존재하지 않습니다." },

    USER_USEREMAIL_EMPTY : { "isSuccess": false, "code": 2014, "message": "이메일을 입력해주세요." },
    USER_USEREMAIL_NOT_EXIST : { "isSuccess": false, "code": 2015, "message": "해당 이메일을 가진 회원이 존재하지 않습니다." },
    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" },
    USER_STATUS_EMPTY: { "isSuccess": false, "code": 2017, "message": "회원의 상태값을 입력해주세요 / Y : 활동, D : 탈퇴, N: 비활성화" },

    USER_STATUS_D : { "isSuccess": false, "code": 2018, "message": "회원 상태값을 확인해주세요. 탈퇴를 원하시면 D를 입력하세요." },
    PRODUCT_SELLINGPRODUCTID_EMPTY: { "isSuccess": false, "code": 2031, "message": "sellingProductId를 입력해주세요" },
    ADDTOWN_USERID_EMPTY: { "isSuccess": false, "code": 2032, "message": "userId를 입력해주세요" },
    ADDTOWN_TOWNNAME_EMPTY: { "isSuccess": false, "code": 2033, "message": "townName를 입력해주세요" },
    PRODUCT_CATEGORYID_EMPTY: { "isSuccess": false, "code": 2034, "message": "categoryId를 입력해주세요" },

    // Response error
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3001, "message":"중복된 이메일입니다." },
    SIGNUP_REDUNDANT_NICKNAME : { "isSuccess": false, "code": 3002, "message":"중복된 닉네임입니다." },

    SIGNIN_PHONENUMBER_WRONG : { "isSuccess": false, "code": 3003, "message": "전화번호가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},


}
