import React, { useEffect, useRef, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaImages } from "react-icons/fa6";
import { IoIosVideocam } from "react-icons/io";
import uploadFile from "../helpers/uploadFile";
import { IoCloseOutline } from "react-icons/io5";
import Loading from "./Loading";
import { IoSend } from "react-icons/io5";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector((state) => state?.user?.soketConnection);
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const hanleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    if (file) {
      const uploadPhotoResponse = await uploadFile(file);
      setLoading(false);
      setOpenImageVideoUpload(false);

      setMessage((preve) => {
        return {
          ...preve,
          imageUrl: uploadPhotoResponse.url,
        };
      });
    }
  };

  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };
  const hanleUploadVideo = async (e) => {
    const file = e.target.files[0];
    setLoading(true);
    setOpenImageVideoUpload(false);

    if (file) {
      const uploadPhotoResponse = await uploadFile(file);
      setLoading(false);

      setMessage((preve) => {
        return {
          ...preve,
          videoUrl: uploadPhotoResponse.url,
        };
      });
    }
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit("seen", params.userId);

      socketConnection.on("message-user", (data) => {
        console.log("user-details", data);
        setDataUser(data);
      });

      socketConnection.on("message", (data) => {
        console.log("Message data", data);
        setAllMessage(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div>
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4 ">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>

          <div>
            {dataUser?.profile_pic ? (
              <img
                className="rounded-full"
                src={dataUser.profile_pic}
                width={50}
                alt="profile_pic"
              />
            ) : (
              <VscAccount size={50} />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-1 ">
              {dataUser.online ? (
                <span className="text-[#45c161]">Đang hoạt động</span>
              ) : (
                <span className="text-slate-400 ">
                  Người dùng hiện không online
                </span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-blue-700">
            <HiDotsVertical />
          </button>
        </div>
      </header>

      {/* message */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative">
        {/* All message here */}
        <div className="flex flex-col gap-2 py-2 mx-2" ref={currentMessage}>
          {allMessage.map((msg, index) => {
            return (
              <div
                className={`bg-white p-1 py-1 rounded w-fit max-w-[280px] md:max-w-sm lg:max-w-md ${
                  user?._id === msg.msgByUserId ? "ml-auto bg-[#e5efff]" : ""
                }`}
              >
                <div className="w-full relative">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl}
                      alt={msg?.imageUrl}
                      className="w-full h-full object-scale-down"
                    />
                  )}
                  {msg?.videoUrl && (
                    <video
                      src={msg.videoUrl}
                      className="w-full h-full object-scale-down"
                      controls
                    />
                  )}
                </div>
                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>

        {/*  */}
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-slate-600"
              onClick={handleClearUploadImage}
            >
              <IoCloseOutline size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-auto w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/*  */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-slate-600"
              onClick={handleClearUploadVideo}
            >
              <IoCloseOutline size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-video w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full flex sticky bottom-0 justify-center items-center">
            <Loading />
          </div>
        )}
      </section>

      {/* Send Message */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-black hover:text-white"
            onClick={handleUploadImageVideoOpen}
          >
            <FaPlus size={18} />
          </button>

          {/* Image & Video */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-100 cursor-pointer"
                >
                  <div>
                    <FaImages size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-100 cursor-pointer"
                >
                  <div>
                    <IoIosVideocam size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={hanleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={hanleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            className="py-1 px-4 outline-none w-full h-full"
            value={message.text}
            onChange={handleOnChange}
          />
          <button className="hover:text-slate-500">
            <IoSend size={20} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
