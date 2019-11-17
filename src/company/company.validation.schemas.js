'use strict';


exports.companyRegistrationSchema = {
  'addresses.*.postalCode': {
    // Make this field optional when undefined or null
/*    optional: {
      options: {
        nullable: true
      }
    },
    isPostalCode: true,*/
    isLength: {min: 10}
  },
  "contact.*": {

    //notEmpty: true,
    isEmail: {
      errorMessage: "Invalid Email"
    },
    isLength: {
      min: 20
    }
  },
  "password": {
    //notEmpty: true,
    isLength: {
      options: [{min: 12}],
      errorMessage: "Password must be at least 12 characters."
    },
    matches: {
      options: ["(?=.*[a-zA-Z])(?=.*[0-9]+)(?=.*[!*&^%$#@()+]+).*", "g"],
      errorMessage: "Password must be alphanumeric."
    },
    errorMessage: "Invalid password"
  }
};

exports.companyLoginSchema = {
  "email": {
    // notEmpty: true,
    isEmail: {
      errorMessage: "Invalid email"
    },
  }
};
