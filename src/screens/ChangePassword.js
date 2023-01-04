import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlobsImg from "../assets/images/blob1.svg";
import BlobsImg2 from "../assets/images/blob2.svg";
import Topbar from "../components/Topbar";
import authApi from "../services/auth-service";
import notificationSvc from "../services/notification-service";

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordChange = async () => {
    if (currentPassword !== "") {
      const response = await authApi.changePassword(currentPassword, password);
      if (response !== false) {
        navigate("/", { replace: true });
      }
    }
  };
  return (
    <>
      {" "}
      <div className="main">
        <Topbar show={false} />
        <div className="login-main">
          <div className="container">
            <div className="card-login mx-auto">
              <div className="card-inner-content">
                <h3 className="mb-4">Change Password</h3>
                <div className="mb-3">
                  <label>Current password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label>Create new password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label>Confirm new password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="btn btn-dark w-100"
                  disabled={!(password === confirmPassword) || password === ""}
                  onClick={passwordChange}
                >
                  Continue
                </button>
              </div>
              <img src={BlobsImg} alt="animate images" className="blob1" />
              <img src={BlobsImg2} alt="animate images" className="blob2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
