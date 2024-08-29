const config = {
    registrationApi: process.env.REACT_APP_REGISTER_API ,
    loginApi: process.env.REACT_APP_LOGIN_API ,
    passwordResetApi:process.env.REACT_APP_FORGET_PASSWORD_API,
    googleAuthLoginApi: process.env.REACT_APP_GOOGLE_AUTH_API ,
    getProductApi: process.env.REACT_APP_GET_PRODUCT_API ,
    createProductApi: process.env.REACT_APP_ADD_PRODUCT_API ,
    deleteProductApi: process.env.REACT_APP_DELETE_PRODUCT_API ,
    updateProductApi: process.env.REACT_APP_EDIT_PRODUCT_API ,
    productDetailsApi: process.env.REACT_APP_PRODUCT_DETAILS_API ,
    getCategoryApi:process.env.REACT_APP_GET_CATEGORY_API,
  };
   
  export default config;