import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/uploadFile";
import axios from "axios";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  });

  const navigate = useNavigate();

  const [uploadPhoto, setUploadPhoto] = useState(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preven) => ({
      ...preven,
      [name]: value,
    }));
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadPhotoResponse = await uploadFile(file);
      setUploadPhoto(file);
      setData((preven) => ({
        ...preven,
        profile_pic: uploadPhotoResponse?.url,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);

    const URL = `${process.env.REACT_APP_BASE_URI}/api/register`;

    try {
      const response = await axios.post(URL, data);
      console.log(response.data);
      toast.success(response?.data?.message);
      if (response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        });

        navigate("/email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
        <h3 className="font-bold">Welcome!</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              className="bg-slate-100 px-2 py-1"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="bg-slate-100 px-2 py-1"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-slate-100 px-2 py-1"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">Photo:</label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1"
              onChange={handleUploadPhoto}
            />
          </div>

          <button className="bg-blue-500 px-4 py-1 rounded mt-3 text-white hover:bg-blue-600">
            Register
          </button>
        </form>
        <p className="mt-3 text-center">
          Đã có tài khoản?{" "}
          <Link to={"/email"} className="text-blue-500 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
