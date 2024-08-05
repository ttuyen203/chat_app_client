import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { VscAccount } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/userSlice";

const CheckPasswordPage = () => {
  // State để lưu trữ dữ liệu password
  const [data, setData] = useState({
    password: "",
  });

  // Hook useNavigate từ React Router để điều hướng trang
  const navigate = useNavigate();

  // Dispatch function từ Redux để set token khi login thành công
  const dispatch = useDispatch();

  // Hook useLocation để lấy thông tin state từ trang trước
  const location = useLocation();

  // Effect để kiểm tra nếu không có state name thì điều hướng về trang nhập email
  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, [location, navigate]);

  // Xử lý khi thay đổi input password
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý khi submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gọi API để xác thực mật khẩu
    const URL = `${process.env.REACT_APP_BASE_URI}/api/password`;
    try {
      const response = await axios({
        method: "post",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });

      // Hiển thị thông báo thành công và lưu token vào local storage
      toast.success(response?.data?.message);
      if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate("/");
      }
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-sm rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2">
          {/* Hiển thị ảnh đại diện nếu có */}
          {location?.state?.profile_pic ? (
            <img
              className="rounded-full"
              src={location.state.profile_pic}
              alt="Profile"
              width={80}
            />
          ) : (
            <VscAccount size={60} />
          )}
        </div>
        {/* Hiển thị thông tin chào mừng người dùng */}
        <h3 className="font-bold text-center">
          Welcome! {location?.state?.name}
        </h3>
        {/* Form nhập mật khẩu */}
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
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

          {/* Button submit */}
          <button className="bg-blue-500 px-4 py-1 rounded mt-3 text-white hover:bg-blue-600">
            Submit
          </button>
        </form>

        {/* Link đến trang quên mật khẩu */}
        <p className="mt-3 text-center">
          <Link
            to={"/forgot-password"}
            className="text-black-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
