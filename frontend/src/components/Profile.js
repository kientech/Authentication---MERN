import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/user-avatar.png";
import styles from "../styles/Username.module.css";
import extend from "../styles/Profile.module.css";
import { useFormik } from "formik";
import { profileValidation } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import convertToBase64 from "../helper/convert";
import useFetch from "../hooks/fetch.hook";
import { useAuthStore } from "../store/store";
import { updateUser } from "../helper/helper";

const Profile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const username = useAuthStore((state) => state.auth.username);
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      email: apiData?.email || "",
      mobile: apiData?.mobile || "",
      address: apiData?.address || "",
    },
    validate: profileValidation,
    enableReinitialize: true,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // values = await Object.assign(values, { profile: file || "" });
      values = { ...values, profile: file || apiData?.profile || "" };
      let updatePromise = updateUser(values);
      console.log("🚀 ~ onSubmit: ~ updatePromise:", updatePromise);
      toast.promise(updatePromise, {
        loading: "Updating...",
        success: <b>Updated Successfully</b>,
        error: <b>Can not Update</b>,
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/");
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
                  src={apiData?.profile || file || avatar}
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
                  {...formik.getFieldProps("firstName")}
                  className={styles.textbox}
                  type="text"
                  placeholder="First Name"
                />
                <input
                  {...formik.getFieldProps("lastName")}
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
                <button className="text-red-500" onClick={handleLogOut}>
                  Log out
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
