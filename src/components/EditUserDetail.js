import React, { useEffect, useRef, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import uploadFile from "../helpers/uploadFile";
import Divider from "./Divider";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";

const EditUserDetail = ({ onClose, user }) => {
  // State để lưu thông tin người dùng khi chỉnh sửa
  const [data, setData] = useState({
    name: user?.name || "",
    profile_pic: user?.profile_pic || "",
  });

  // Ref để tham chiếu đến input file upload
  const uploadPhotoRef = useRef();

  // Dispatch function từ Redux
  const dispatch = useDispatch();

  // Effect để cập nhật data khi user thay đổi
  useEffect(() => {
    setData({
      name: user?.name || "",
      profile_pic: user?.profile_pic || "",
    });
  }, [user]);

  // Xử lý thay đổi input
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Mở dialog chọn ảnh
  const handleOpenUploadPhoto = (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadPhotoRef.current.click();
  };

  // Xử lý upload ảnh
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const uploadPhotoResponse = await uploadFile(file);
      setData((prevData) => ({
        ...prevData,
        profile_pic: uploadPhotoResponse?.url,
      }));
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const URL = `${process.env.REACT_APP_BASE_URI}/api/update-user`;

      // Lọc bỏ các thuộc tính không cần thiết hoặc gây ra vòng lặp
      const { name, profile_pic } = data;

      const response = await axios({
        method: "post",
        url: URL,
        data: { name, profile_pic },
        withCredentials: true,
      });

      // Hiển thị thông báo thành công
      toast.success(response?.data?.message);

      if (response.data.success) {
        // Cập nhật thông tin người dùng trong Redux
        dispatch(setUser(response.data.data));
        onClose(); // Đóng form chỉnh sửa
      }
    } catch (error) {
      console.log(error);
      // Hiển thị thông báo lỗi
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Thông tin người dùng</h2>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>
          {/* Input tên người dùng */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-blue-300 border"
            />
          </div>

          {/* Input upload ảnh đại diện */}
          <div className="flex flex-col gap-1">
            <label htmlFor="profile_pic">Photo:</label>
            <div className="my-1 flex items-center gap-3">
              {data?.profile_pic ? (
                <img
                  className="rounded-full"
                  src={data?.profile_pic}
                  width={30}
                  alt="profile_pic"
                />
              ) : (
                <VscAccount size={20} />
              )}
              <button className="font-semibold" onClick={handleOpenUploadPhoto}>
                Chỉnh sửa
              </button>
              <input
                type="file"
                className="hidden"
                onChange={handleUploadPhoto}
                ref={uploadPhotoRef}
              />
            </div>
          </div>

          <Divider />

          {/* Nút thoát và nút lưu */}
          <div className="flex gap-2 ml-auto">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
              onClick={onClose}
            >
              Thoát
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded"
              onClick={handleSubmit}
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(EditUserDetail);
