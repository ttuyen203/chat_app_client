import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { VscAccount } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetail from "./EditUserDetail";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";
import { FaImage } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa6";
import toast from "react-hot-toast";

const Sidebar = () => {
  // Lấy thông tin người dùng từ Redux store
  const user = useSelector((state) => state?.user);

  const socketConnection = useSelector((state) => state?.user?.soketConnection);

  // State để quản lý việc mở/closed phần chỉnh sửa thông tin người dùng
  const [editUserOpen, setEditUserOpen] = useState(false);

  const [allUser, setAllUser] = useState([]);

  const [openSearchUser, setOpenSearchUser] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    toast.success("Đăng xuất thành công");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-100 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        {/* Nút Chat */}
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 ${
                isActive && "bg-slate-200"
              }`
            }
            title="Chat"
          >
            <IoChatbubbleEllipsesSharp size={20} />
          </NavLink>

          {/* Nút Add Friend */}
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200"
            title="Add Friend"
            onClick={() => setOpenSearchUser(true)}
          >
            <FaUserPlus size={20} />
          </div>
        </div>

        {/* Nút User Profile */}
        <div>
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200"
            onClick={() => setEditUserOpen(true)}
          >
            {/* Hiển thị ảnh đại diện người dùng hoặc biểu tượng User mặc định */}
            {user?.profile_pic ? (
              <img
                className="rounded-full"
                src={user.profile_pic}
                width={30}
                alt="profile_pic"
              />
            ) : (
              <VscAccount size={20} />
            )}
          </button>

          {/* Nút Logout */}
          <button
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200"
            onClick={handleLogout}
            title="logout"
          >
            <span className="-ml-2">
              <BiLogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* List Friend */}
      <div className="w-full">
        <div className="h-16 flex items-center">
          <h2 className="text-xl font-bold p-4 text-slate-800">Message</h2>
        </div>

        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <p className="text-sm text-center text-slate-400">
                Danh sách trò chuyện hiện đang trống.
                <br /> Hãy bắt đầu cuộc trò chuyện mới!
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-slate-100 rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  {/* Hiển thị ảnh đại diện người dùng hoặc biểu tượng User mặc định */}
                  {conv?.userDetails?.profile_pic ? (
                    <img
                      className="rounded-full"
                      src={conv?.userDetails?.profile_pic}
                      width={30}
                      alt="profile_pic"
                    />
                  ) : (
                    <VscAccount size={20} />
                  )}
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaImage />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-[#b6bec9] text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Hiển thị phần chỉnh sửa thông tin người dùng nếu state editUserOpen là true */}
      {editUserOpen && (
        <EditUserDetail onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/*  */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
