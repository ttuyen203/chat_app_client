import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const CheckEmailPage = () => {
  // State để lưu trữ dữ liệu email
  const [data, setData] = useState({
    email: "",
  });

  // Hook useNavigate từ React Router để điều hướng trang
  const navigate = useNavigate();

  // Xử lý khi thay đổi input email
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

    // Gọi API để kiểm tra email
    const URL = `${process.env.REACT_APP_BASE_URI}/api/email`;
    try {
      const response = await axios.post(URL, data);
      toast.success(response?.data?.message);

      // Nếu thành công, điều hướng đến trang reset password và truyền dữ liệu qua state
      if (response.data.success) {
        setData({
          email: "",
        });
        navigate("/password", {
          state: response?.data.data,
        });
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
        <h3 className="font-bold text-center text-xl">Login</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
          {/* Input email */}
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

          {/* Button submit */}
          <button className="bg-blue-500 px-4 py-1 rounded mt-3 text-white hover:bg-blue-600">
            Submit
          </button>
        </form>

        {/* Link đến trang đăng ký */}
        <p className="mt-3 text-center">
          Bạn chưa có tài khoản?{" "}
          <Link to={"/register"} className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckEmailPage;
