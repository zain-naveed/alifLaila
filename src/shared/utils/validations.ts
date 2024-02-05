import * as yup from "yup";
import { bookTypeEnums } from "./pageConstant/partner/form2Constant";
const usernameReg = /^[a-zA-Z0-9_]+$/;
const passwordRegExp = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/;

const LoginVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required Field!")
    .label("email")
    .email("Invalid Email"),
  password: yup.string().required("Password is Required").label("password"),
});

const KidLoginVS = yup.object().shape({
  email: yup
    .string()
    .required("Email/Username is Required Field!")
    .label("email"),
  password: yup
    .string()
    .required("Password/Pincode is Required")
    .label("password"),
});

const SignUpVS = yup.object().shape({
  username: yup.string().required("Username is Required").label("username"),
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  phonenumber: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Phone Number is Required")
    .label("phonenumber"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
  dob: yup.string().required("Date of Birth is Required").label("dob"),
  gender: yup.string().required("Gender is Required").label("gender"),
});
const publisherEmailVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required Field!")
    .label("email")
    .email("Invalid Email"),
});
const forgotPasswordVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required Field!")
    .label("email")
    .email("Invalid Email"),
});
const otpVS = yup.object().shape({
  otp: yup
    .string()
    .required("Otp is Required Field!")
    .label("otp")
    .max(4)
    .min(4, "OTP must be at least 4 characters"),
});
const AgeVS = yup.object().shape({
  age: yup
    .string()
    .required("Year is Required Field!")
    .label("age")
    .max(4)
    .min(4, "Year must be at least 4 characters")
    .test(
      "age",
      "Age must not be less than 4 years",
      //@ts-ignore
      (val) => {
        if (val) {
          let year = new Date().getFullYear();
          let diff = Number(year) - Number(val);
          return diff > 3;
        }
      }
    )
    .test(
      "age",
      "Age must be less than 18 years",
      //@ts-ignore
      (val) => {
        if (val) {
          let year = new Date().getFullYear();
          let diff = Number(year) - Number(val);
          return diff < 18;
        }
      }
    ),
});
const resetPasswordVS = yup.object().shape({
  password: yup
    .string()
    .required("Password is Required")
    .label("password")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});
const publisherRegisterVs = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  phonenumber: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Phone Number is Required")
    .label("phonenumber"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),

  publishingHouseName: yup
    .string()
    .required("Publishing house name is Required")
    .label("publishingHouseName"),
  publisherRole: yup
    .string()
    .required("Publisher role is Required")
    .label("publisherRole"),
  webUrl: yup.string().optional().label("webUrl"),
  pubAddress: yup
    .string()
    .required("Publisher address is rquired")
    .label("pubAddress"),
  profilePicture: yup
    .mixed()
    .required("Profile picture is required")
    .label("profilePicture"),
  aboutPublisher: yup
    .string()
    .optional()
    .label("aboutPublisher")
    .max(500, "About must be less than 500 characters"),
  publishingHouseLogo: yup
    .mixed()
    .required("Publishing house logo is required")
    .label("publishingHouseLogo"),
});
const authorRegisterVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  phonenumber: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Phone Number is Required")
    .label("phonenumber"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
  webUrl: yup.string().optional().label("webUrl"),
  pubAddress: yup
    .string()
    .required("Publisher address is rquired")
    .label("pubAddress"),
  profilePicture: yup
    .mixed()
    .optional()
    .label("profilePicture"),
  aboutAuthor: yup
    .string()
    .optional()
    .label("aboutPublisher")
    .max(500, "About must be less than 500 characters"),
});
const addBookForm1VS = yup.object().shape({
  bookDescription: yup
    .string()
    .required("Book Description is Required")
    .label("bookDescription"),
  bookName: yup
    .string()
    .required("Book Name is Required")
    .trim("The Book Name cannot include leading and trailing spaces")
    .strict(true)
    .label("bookName"),
  uploadCover: yup
    .mixed()
    .required("Upload Cover Photo is required")
    .label("uploadCover"),
  uploadBook: yup
    .mixed()
    .required("Upload Book is required")
    .label("uploadBook"),
  genre: yup
    .array()
    .min(1, "Genre field must have at least 1 items")
    .required("Genre is required")
    .label("genre"),
});
const addBookForm2VS = yup.object().shape({
  bookKeywords: yup
    .array()
    .min(1, "Keywords must have at least 1 items")
    .required("book keywords is required")
    .label("bookKeywords"),
  ageRange: yup.string().required("Age is Required").label("ageRange"),
  lang: yup.string().required("Language is required").label("lang"),
  authorName: yup
    .string()
    .required("Author Name is required")
    .label("authorName"),
  bookType: yup.string().label("bookType"),
  bookBorrow: yup
    .string()
    .optional()
    .when("bookType", ([bookType]: any, schema: any): any => {
      if (bookType == String(bookTypeEnums.Premium)) {
        return yup
          .string()
          .required("Book Borrow is required")
          .label("bookBorrow");
      }
    }),
  bookCoin: yup
    .string()
    .optional()
    .when("bookType", ([bookType]: any, schema: any): any => {
      if (bookType == String(bookTypeEnums.Premium)) {
        return yup.string().required("Coins is required").label("bookCoin");
      }
    }),
  bookHardCopy: yup.string().label("bookHardCopy"),
  bookWeight: yup
    .string()
    .optional()
    .when("bookHardCopy", ([bookHardCopy]: any, schema: any): any => {
      if (bookHardCopy == String(bookTypeEnums.Free)) {
        return yup
          .string()
          .required("Book Weight is required")
          .label("bookWeight");
      }
    }),
  bookPrice: yup
    .string()
    .optional()
    .when("bookHardCopy", ([bookHardCopy]: any, schema: any): any => {
      if (bookHardCopy == String(bookTypeEnums.Free)) {
        return yup
          .string()
          .required("Book Price is required")
          .label("bookPrice");
      }
    }),
  quiz: yup.string().label("quiz"),
  linkAuthor: yup.string().optional().label("linkAuthor"),
  author: yup
    .mixed()
    .optional()
    .when("linkAuthor", ([linkAuthor]: any, schema: any): any => {
      if (linkAuthor == String(bookTypeEnums.Free)) {
        return yup.mixed().required("Author is required").label("author");
      }
    }),
});

const editBookForm3VS = yup.object().shape({
  bookKeywords: yup
    .array()
    .min(1, "Keywords must have at least 1 items")
    .required("book keywords is required")
    .label("bookKeywords"),
  bookType: yup.string().label("bookType"),
  bookBorrow: yup
    .string()
    .optional()
    .when("bookType", ([bookType]: any, schema: any): any => {
      if (bookType == String(bookTypeEnums.Premium)) {
        return yup
          .string()
          .required("Book Borrow is required")
          .label("bookBorrow");
      }
    }),
  bookCoin: yup
    .string()
    .optional()
    .when("bookType", ([bookType]: any, schema: any): any => {
      if (bookType == String(bookTypeEnums.Premium)) {
        return yup.string().required("Coins is required").label("bookCoin");
      }
    }),
  bookHardCopy: yup.string().label("bookHardCopy"),
  bookWeight: yup
    .string()
    .optional()
    .when("bookHardCopy", ([bookHardCopy]: any, schema: any): any => {
      if (bookHardCopy == String(bookTypeEnums.Free)) {
        return yup
          .string()
          .required("Book Weight is required")
          .label("bookWeight");
      }
    }),
  bookPrice: yup
    .string()
    .optional()
    .when("bookHardCopy", ([bookHardCopy]: any, schema: any): any => {
      if (bookHardCopy == String(bookTypeEnums.Free)) {
        return yup
          .string()
          .required("Book Price is required")
          .label("bookPrice");
      }
    }),
  quiz: yup.string().label("quiz"),
});

const crateQuizVS = yup.object().shape({
  quizTitle: yup.string().required("Quiz Title is Required").label("quizTitle"),
  quizDescr: yup.string().optional().label("quizDescr"),
});

const updateQuizVS = yup.object().shape({
  quizTitle: yup.string().required("Quiz Title is Required").label("quizTitle"),
  quizDescr: yup.string().optional().label("quizDescr"),
});

const addQuestionVS = yup.object().shape({
  question: yup.string().required("Question is Required").label("question"),
  correctAns: yup
    .string()
    .required("Correct Answer is required")
    .label("correctAns"),
  incorrectAns1: yup
    .string()
    .required("Answer is required")
    .label("incorrectAns1"),
  incorrectAns2: yup.string().optional().label("incorrectAns2"),
  incorrectAns3: yup.string().optional().label("incorrectAns3"),
});
const updateQuestionVS = yup.object().shape({
  question: yup.string().required("Question is Required").label("question"),
  correctAns: yup
    .string()
    .required("Correct Answer is required")
    .label("correctAns"),
  incorrectAns1: yup
    .string()
    .required("Answer is required")
    .label("incorrectAns1"),
  incorrectAns2: yup.string().optional().label("incorrectAns2"),
  incorrectAns3: yup.string().optional().label("incorrectAns3"),
});
const changePasswordVS = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current Password is Required")
    .label("currentPassword"),
  newPassword: yup
    .string()
    .required("New Password is Required")
    .label("newPassword")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("New Password is Required")
    .oneOf([yup.ref("newPassword"), ""], "Passwords must match")
    .label("confirmPassword"),
});
const updateProfileVS = yup.object().shape({
  isPublisher: yup.boolean(),
  banner: yup.mixed().optional().label("banner"),
  fName: yup.string().required("First Name is Required").label("fName"),
  lName: yup.string().required("Last Name is Required").label("lName"),
  email: yup.string().email().required("Email is Required").label("email"),
  contactNumb: yup
    .string()
    .required("Contact Number is Required")
    .label("contactNumb"),
  publisherHouse: yup.string().when("isPublisher", {
    is: true,
    then: (schema) =>
      schema
        .required("Publisher House name is Required")
        .label("publisherHouse"),
  }),

  publisherRole: yup.string().when("isPublisher", {
    is: true,
    then: (schema) =>
      schema.required("Publisher role is Required").label("publisherRole"),
  }),
  webUrl: yup.string().required("Webiste Url is Required").label("webUrl"),
  address: yup.string().required("Address is Required").label("address"),
  profilePicture: yup.mixed().optional().label("profilePicture"),
  publishingHouseLogo: yup.mixed().when("isPublisher", {
    is: true,
    then: (schema) => schema.optional().label("publishingHouseLogo"),
  }),
});
const publishserAccountDetail = yup.object().shape({
  accountTitle: yup
    .mixed()
    .required("Account Title is Required")
    .label("accountTitle"),
  bankName: yup.string().required("Bank Name is Required").label("bankName"),
  accountNumber: yup
    .string()
    .required("Account Number is required!")
    .label("accountNumber"),
  confirmAccountNumber: yup
    .string()
    .required("Account Number is required!")
    .label("confirmAccountNumber")
    .oneOf([yup.ref("accountNumber"), ""], "Account Number must match"),
});
const signMouVS = yup.object().shape({
  signature: yup.string().required("Signature is Required").label("signature"),
});
const kidRegisterVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  grade: yup.string().optional().label("grade"),
  schoolname: yup.string().label("schoolname"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

const kidEditVS = yup.object().shape({
  isIndividual: yup.boolean(),
  email: yup.string().when("isIndividual", {
    is: true,
    then: (schema) =>
      schema
        .required("Email is Required Field!")
        .label("email")
        .email("Invalid Email"),
  }),
  username: yup.string().when("isIndividual", {
    is: false,
    then: (schema) => schema.required("Username is Required").label("username"),
  }),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  grade: yup.string().optional().label("grade"),
  schoolname: yup.string().label("schoolname"),
});

const AddAddressVs = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  streetAddress: yup
    .string()
    .required("Street Address is Required")
    .label("streetAddress"),
  province: yup.string().required("Province is Required").label("province"),
  city: yup.string().required("City is Required").label("city"),
  zip: yup.string().required("Zip is Required").label("zip"),
  phone: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Phone Number is Required")
    .label("phone"),
});

const WriteReviewVS = yup.object().shape({
  rating: yup
    .number()
    .min(1, "Book Rating is Compulsory!")
    .required("Book Rate is Compulsory!")
    .label("rating"),
  description: yup.string().optional().label("description"),
});

const ParentRegisterVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  number: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Contact Number is Required")
    .label("number"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      passwordRegExp,
      "Password must contain at least One Upper Case Character, One Lower Case Character, One Special Character and One Number"
    ),
  confirmPassword: yup
    .string()
    .required("Confirm Password is Required")
    .oneOf([yup.ref("password"), ""], "Passwords must match"),
});

const AddkidVS = yup.object().shape({
  username: yup
    .string()
    .required("Username is Required")
    .label("username")
    .matches(usernameReg, "username must not include special charaters")
    .min(5, "Username must not be lesser then 5 Characters"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  grade: yup.string().required("Grade is Required").label("grade"),
  pin: yup
    .string()
    .label("pin")
    .required("Pin is Required")
    .min(4, "Pin must not be lesser then 4 Characters")
    .max(4, "Pin must not be greater then 4 Characters"),
  confirmPin: yup
    .string()
    .label("pin")
    .required("Confirm pin is Required")
    .min(4, "Pin must not be lesser then 4 Characters")
    .max(4, "Pin must not be greater then 4 Characters")
    .oneOf([yup.ref("pin"), ""], "Pin must match"),
  year: yup.string().required("Year is Required"),
});

const ParentEditVS = yup.object().shape({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid Email")
    .label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  number: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Contact Number is Required")
    .label("number"),
});

const AddTicketVS = yup.object().shape({
  title: yup.string().required("Ticket Title is Required").label("title"),
  type: yup.string().required("Ticket Type is Required").label("type"),
  messages: yup
    .string()
    .required("Message is Required")
    .label("messages")
    .max(2500, "Message Maximum Limit is 2500 Characters"),
});

const FeatureRequestVS = yup.object().shape({
  start: yup.string().required("Start Date is Required").label("start"),
  end: yup.string().required("Due Date is Required").label("end"),
});

const AssignBookVS = yup.object().shape({
  due: yup.string().optional().label("due"),
});

const AddAuthorVS = yup.object().shape({
  email: yup.string().email().required("Username is Required").label("email"),
  firstname: yup.string().required("Firstname is Required").label("firstname"),
  lastname: yup.string().required("Lastname is Required").label("lastname"),
  phone: yup
    .string()
    .min(10, "Phone Number Must be 10 Numbers")
    .max(12, "Phone Number Maximum Limit is 12 Numbers")
    .required("Phone Number is Required")
    .label("phone"),
  // websitelink: yup
  //   .string()
  //   .label("websitelink")
  //   .required("Website is Required"),
  percentage: yup
    .string()
    .required("Earning Percentage is Required")
    .label("percentage"),
});

const SendPaymentVS = yup.object().shape({
  banner: yup.mixed().required("Transaction Photo is required").label("banner"),
  transactionId: yup
    .string()
    .required("Transaction Id is Required")
    .label("transactionId"),
  date: yup.string().required("Date is Required").label("date"),
});

const PaymentScreenShotVS = yup.object().shape({
  transId: yup.string().required("Transaction Id is Required").label("transId"),
  transDate: yup
    .string()
    .required("Transaction Date is Required")
    .label("transDate"),
  file: yup.mixed().required("Screenshot is Required").label("file"),
});

export {
  LoginVS,
  SignUpVS,
  publisherEmailVS,
  forgotPasswordVS,
  otpVS,
  resetPasswordVS,
  publisherRegisterVs,
  addBookForm1VS,
  crateQuizVS,
  updateQuizVS,
  addQuestionVS,
  updateQuestionVS,
  changePasswordVS,
  updateProfileVS,
  publishserAccountDetail,
  signMouVS,
  addBookForm2VS,
  AgeVS,
  kidEditVS,
  kidRegisterVS,
  AddAddressVs,
  WriteReviewVS,
  ParentRegisterVS,
  AddkidVS,
  ParentEditVS,
  AddTicketVS,
  FeatureRequestVS,
  AssignBookVS,
  editBookForm3VS,
  authorRegisterVS,
  AddAuthorVS,
  KidLoginVS,
  SendPaymentVS,
  PaymentScreenShotVS,
};
