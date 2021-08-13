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

    ADDCART_USERID_EMPTY: { "isSuccess": false, "code": 2014, "message":"userId를 입력해주세요" },
    ADDCART_RESTID_EMPTY: { "isSuccess": false, "code": 2015, "message":"restId를 입력해주세요" },
    ADDCART_CARTID_EMPTY: { "isSuccess": false, "code": 2016, "message":"cartId를 입력해주세요" },
    ADDCART_MENUID_EMPTY: { "isSuccess": false, "code": 2017, "message":"menuId를 입력해주세요" },
    ADDCART_MENUCOUNT_EMPTY: { "isSuccess": false, "code": 2018, "message":"menuCount를 입력해주세요" },
    ADDCART_ADDITIONALMENUID_EMPTY: { "isSuccess": false, "code": 2019, "message":"additionalMenuId를 입력해주세요" },
    ADDCART_USERID_NOTNUM: { "isSuccess": false, "code": 2021, "message":"userId는 숫자로 입력해주세요" },
    ADDCART_RESTID_NOTNUM: { "isSuccess": false, "code": 2022, "message":"restId는 숫자로 입력해주세요" },
    ADDCART_CARTID_NOTNUM: { "isSuccess": false, "code": 2023, "message":"cartId는 숫자로 입력해주세요" },
    ADDCART_MENUID_NOTNUM: { "isSuccess": false, "code": 2024, "message":"menuId는 숫자로 입력해주세요" },
    ADDCART_MENUCOUNT_NOTNUM: { "isSuccess": false, "code": 2025, "message":"menuCount는 숫자로 입력해주세요" },
    ADDCART_ADDITIONALMENUID_NOTNUM: { "isSuccess": false, "code": 2026, "message":"additionalMenuId는 숫자로 입력해주세요" },

    USER_ID_NOT_MATCH: { "isSuccess": false, "code": 2027, "message":"userId가 일치하지 않습니다. jwt를 확인해 주세요" },

    ADDORDER_CARTID_EMPTY: { "isSuccess": false, "code": 2028, "message":"cartId를 입력해주세요" },
    ADDORDER_CARTID_NOTNUM: { "isSuccess": false, "code": 2029, "message":"cartId는 숫자로 입력해주세요" },

    REPPAY_USERID_EMPTY: { "isSuccess": false, "code": 2030, "message":"userId를 입력해주세요" },
    REPPAY_USERID_NOTNUM: { "isSuccess": false, "code": 2031, "message":"userId는 숫자로 입력해주세요" },

    REVIEW_RESTID_EMPTY: { "isSuccess": false, "code": 2032, "message":"restId를 입력해주세요" },
    REVIEW_REVEWID_EMPTY: { "isSuccess": false, "code": 2033, "message":"reviewId를 입력해주세요" },
    REVIEW_USERID_EMPTY: { "isSuccess": false, "code": 2034, "message":"userId를 입력해주세요" },
    REVIEW_REVIEWCONTEN_EMPTY: { "isSuccess": false, "code": 2035, "message":"리뷰 내용을 입력해주세요" },
    REVIEW_STAR_EMPTY: { "isSuccess": false, "code": 2036, "message":"별점을 입력해주세요" },
    REVIEW_USERID_NOTNUM: { "isSuccess": false, "code": 2037, "message":"userId는 숫자로 입력해주세요" },
    REVIEW_RESTID_NOTNUM: { "isSuccess": false, "code": 2038, "message":"restId는 숫자로 입력해주세요" },
    REVIEW_STAR_RANGE: { "isSuccess": false, "code": 2039, "message":"별점은 0~5 사이의 숫자로 입력해주세요" },
    REVIEW_CONTENT_RANGE: { "isSuccess": false, "code": 2040, "message":"리뷰는 200자 이내로 입력해주세요" },

    ADDADDRESS_EMD_NAME_EMPTY: { "isSuccess": false, "code": 2041, "message":"읍/면/동을 입력해주세요" },
    ADDADDRESS_DETAIL_ADDRESS_EMPTY: { "isSuccess": false, "code": 2042, "message":"상세주소를 입력해주세요" },
    DETAIL_ADDRESS_LENGTH: { "isSuccess": false, "code": 2043, "message":"상세주소는 50자 이내로 입력해주세요" },
    ADDADDRESS_INTRODUCTION_LENGTH: { "isSuccess": false, "code": 2044, "message":"길안내는 100자 이내로 입력해주세요" },
    ADDADDRESS_ADDRESS_CATEGORY_EMPTY: { "isSuccess": false, "code": 2045, "message":"home, comapny, etc 중 하나를 입력해주세요" },
    ADDADDRESS_ADDRESS_ID_EMPTY: { "isSuccess": false, "code": 2046, "message":"userAddressId를 입력해주세요" },

    USERID_NOT_INT: { "isSuccess": false, "code": 2047, "message":"userId를 정수값으로 입력해주세요" },
    USERID_NOT_POSITIVE: { "isSuccess": false, "code": 2048, "message":"userId를 양의 정수로 입력해주세요" },

    USERADDRESSID_NOT_INT: { "isSuccess": false, "code": 2049, "message":"userAddressId를 정수값으로 입력해주세요" },
    USERADDRESSID_NOT_POSITIVE: { "isSuccess": false, "code": 2050, "message":"userAddressId를 양의 정수로 입력해주세요" },

    SEARCH_CONTENT_EMPTY: { "isSuccess": false, "code": 2051, "message":"searchContent를 입력해주세요" },
    SEARCH_CONTENT_LENGTH: { "isSuccess": false, "code": 2051, "message":"searchContent는 45자 이내로 입력해주세요" },



    // Response error
    SIGNUP_REDUNDANT_PHONENUMBER : { "isSuccess": false, "code": 3001, "message":"중복된 전화번호입니다." },
    SIGNUP_REDUNDANT_EMAIL : { "isSuccess": false, "code": 3002, "message":"중복된 이메일입니다." },

    SIGNIN_USEREMAIL_WRONG : { "isSuccess": false, "code": 3003, "message": "아이디가 잘못 되었습니다." },
    SIGNIN_PASSWORD_WRONG : { "isSuccess": false, "code": 3004, "message": "비밀번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    ADDCART_REDUNDANT_CARTID : { "isSuccess": false, "code": 3007, "message":"중복된 카트입니다." },
    ADDCART_REDUNDANT_MENU: { "isSuccess": false, "code": 3008, "message":"해당 메뉴는 이미 카트에 담겼습니다. 추가는 수량을 변경하세요" },

    ADDORDER_REDUNDANT_CARTID: { "isSuccess": false, "code": 3009, "message":"이미 결제된 카트입니다." },

    NOT_EXIST_CART: { "isSuccess": false, "code": 3010, "message":"없는 카트입니다." },

    REVIEW_NOT_ORDER: { "isSuccess": false, "code": 3011, "message":"해당 유저는 이 메뉴를 주문하지 않아 리뷰를 작성할 수 없습니다." },

    EMD_INVAILD_NAME: { "isSuccess": false, "code": 3012, "message":"유효하지 않은 이름입니다. 읍/면/동 이름을 입력해주세요" },

    BOOKMARKS_REDUNDANT: { "isSuccess": false, "code": 3013, "message":"중복된 즐겨찾기입니다." },

    USERADDRESSID_INVALID: { "isSuccess": false, "code": 3014, "message":"존재하지 않는 userAddressId입니다." },


    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},


}
