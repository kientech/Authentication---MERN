import React, { useState } from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/user-avatar.png";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import { Toaster } from "react-hot-toast";
import convertToBase64 from "../helper/convert";

const Profile = () => {
  const [file, setFile] = useState();
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "kien@duongtrung.com",
      mobile: "",
      address: "",
    },
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || "" });
      console.log(values);
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center">
        <div
          className={`${styles.glass} ${extend.glass}`}
          style={{ width: "45%" }}
        >
          <div className="title flex flex-col items-center">
            <h1 className="text-5xl font-bold">Profile</h1>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              You can update your profile
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  alt="avatar"
                  className={`${styles.profile__img} ${extend.profile}`}
                />
              </label>
              <input
                type="file"
                id="profile"
                className="hidden"
                name="profile"
                onChange={onUpload}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("first_name")}
                  className={styles.textbox}
                  type="text"
                  placeholder="First Name"
                />
                <input
                  {...formik.getFieldProps("last_name")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Last Name"
                />
              </div>

              <div className="name flex w-3/4 gap-10">
                <input
                  {...formik.getFieldProps("mobile")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Mobile No."
                />
                <input
                  {...formik.getFieldProps("email")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Email Address"
                />
              </div>
              <div className="name flex justify-center w-full gap-10">
                <input
                  {...formik.getFieldProps("address")}
                  className={styles.textbox}
                  type="text"
                  placeholder="Address"
                />
              </div>
              <button className={styles.btn} type="submit">
                Update
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Comeback Later ?{" "}
                <Link className="text-red-500" to="/">
                  Log out
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
