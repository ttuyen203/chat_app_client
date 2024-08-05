import React from "react";
import { VscAccount } from "react-icons/vsc";
import { Link } from "react-router-dom";

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={"/" + user?._id}
      onClick={onClose}
      className="flex items-center gap-4 p-2 lg:p-4 border border-transparent border-t-slate-200 hover:border hover:border-slate-400 rounded cursor-pointer"
    >
      <div>
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
      </div>

      <div>
        <div className="font-semibold">{user?.name}</div>
        <p className="text-sm text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;
