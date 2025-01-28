import React from "react";
import "./ProfileInfo.css";
import closeIcon from "../../assets/close.svg";
import userIcon from "../../assets/user.svg";

function ProfileInfo({ user, onClose }) {
  const handleClickOutside = (event) => {
    if (event.target.id === "profile-info-backdrop") {
      onClose();
    }
  };

  return (
    <div
      id="profile-info-backdrop"
      className="profile-info-backdrop"
      onClick={handleClickOutside}
    >
      <div className="profile-info-container">
        <button className="close-button" onClick={onClose}>
          <img src={closeIcon} alt="Close" />
        </button>
        <div className="profile-header">
          <img src={userIcon} alt="User" className="profile-icon" />
          <h2>{user.name}</h2>
        </div>
        <div className="profile-info">
          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Website:</strong> {user.website}
          </p>
          <div className="address">
            <h3>
              <strong>Address</strong>
            </h3>
            <p>{user.address.streetA}</p>
            <p>{user.address.streetB}</p>
            <p>{user.address.streetC}</p>
            <p>{user.address.streetD}</p>
            <p>
              {user.address.city}, {user.address.state}, {user.address.country}
            </p>
            <p>{user.address.zipcode}</p>
            <p>
              Geo: {user.address.geo.lat}, {user.address.geo.lng}
            </p>
          </div>
          <div className="company">
            <h3>
              <strong>Company</strong>
            </h3>
            <p>{user.company.name}</p>
            <p>{user.company.catchPhrase}</p>
            <p>{user.company.bs}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInfo;
