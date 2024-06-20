import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/user-avatar.png";
import styles from "../styles/Username.module.css";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import toast, { Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../helper/helper";
import useFetch from "../hooks/fetch.hook";

const Password = () => {
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.auth.username);
  console.log("🚀 ~ Password ~ username:", username);
  const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`);
  console.log("🚀 ~ Password ~ apiData:", apiData);
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Successfully...!</b>,
        error: <b>Password Not Match!</b>,
      });
      loginPromise.then((res) => {
        let {token} = res.data;
        localStorage.setItem("token", token);
        navigate("/profile");
      });
    },
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h1 className="text-5xl font-bold">
              Hello {apiData?.firstName || apiData?.username}
            </h1>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                alt="avatar"
                className={styles.profile__img}
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="Password"
              />
              <button className={styles.btn} type="submit">
                Sign in
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password ?{" "}
                <Link className="text-red-500" to="/recovery">
                  Recovery
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Password;
