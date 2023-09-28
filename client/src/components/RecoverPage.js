import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/avatar.png";
import styles from "../styles/Username.module.css";
import { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";

function RecoveryPage() {
  const formik = useFormik({
    initialValues: {
      password: "admin@123",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h2 className=" py-2 text-4xl font-bold">Recover Password</h2>
            <span className="'py-4 text-xl w-2/3 text-center text-gray-300">Enter OTP to recover password</span>
          </div>
          <form className="pt-20" >
            {/* <div className="profile flex justify-center py-4">
              <img src={avatar} className={styles.profile_img} alt="avatar" />
            </div> */}
            <div className="textbox flex flex-col items-center gap-6">
            <div className="input text-center">
            <span className="py-4 text-sm text-left text-gray-300">Enter 6 digit OTP send to your email address</span>
              <input
               
                className={styles.textbox}
                type="password"
                placeholder="OTP"
              />
            </div>

             
              <button className={styles.btn} type="submit">
                Sign In
              </button>
            </div>

            <div className="text-center ">
              <span className="text-gray-300">
                Can't get OTP?{" "}
                <button className="text-red-500" >
                  Resend OTP
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecoveryPage;