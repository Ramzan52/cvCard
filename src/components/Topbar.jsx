import { Icon } from "@iconify/react";
import Moment from "moment";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import { api } from "../services/api-service";
import ImageCropper from "./ImageCropper";
import notificationSvc from "../services/notification-service";

const Topbar = (props) => {
  let navigate = useNavigate();

  const [employee, setEmployee] = useState([]);
  const [show, setHandleShow] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [image, setImage] = useState();
  const [id, setId] = useState();

  const scrollHandler = () => {
    if (window.scrollY > 100) {
      setHandleShow(true);
    } else {
      setHandleShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener(window, scrollHandler);
    };
  }, []);

  const handleOpenModal = () => {
    let body = document.body;
    body.className = "openProfileDrawer";
  };
  const handleMenuOpen = () => {
    let body = document.body;
    body.className = "openMenu";
  };

  const handleHideModal = () => {
    let body = document.body;
    body.className = "";
  };

  const getEmployeeProfile = async () => {
    const response = await api.get(`Employees/my-profile`);
    if (response && response.ok) {
      setEmployee(response.data);

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response?.data?.name,
          profileUrl: response?.data?.profileUrl,
          email: response?.data?.email,
          designation: response?.data?.designation,
          phoneNumber: response?.data?.phoneNumber,
          startDate: response?.data?.startDate,
          endDate: response?.data?.endDate,
        })
      );
      localStorage.setItem("userId", response?.data?.id);
      setId(localStorage.getItem("userId"));
      localStorage.setItem("profileImage", response?.data?.profileUrl);
      setImage(localStorage.getItem("profileImage"));
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user === null) {
      getEmployeeProfile();
    } else {
      setEmployee(user);
      setId(localStorage.getItem("userId"));
      setImage(localStorage.getItem("profileImage"));
    }
  }, []);

  const {
    designation,
    email,
    endDate,
    name,
    phoneNumber,
    profileUrl,
    startDate,
  } = employee;

  const fileChange = async (e) => {
    if (
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpeg"
    ) {
      const formData = new FormData();
      formData.append("attachment", e.target.files[0]);
      const response = await api.post("upload-attachments", formData);
      if (response) {
        const userImg = await api.put(
          `Employees/update-profile-image/${id}`,
          response.data
        );
        if (userImg) {
          localStorage.setItem("profileImage", response?.data);
          setImage(response?.data);
          notificationSvc.success("Image uploaded successfully");
        }
      }
    } else {
      return notificationSvc.error("Please upload valid image format.");
    }
  };
  return (
    <>
      <div className={`topbar ${show && "sticky"}`}>
        <div className="brand_name d-xl-none d-inline-block">
          <Link to="#">
            <img src={Logo} alt="" />
          </Link>
        </div>
        {props.showSearch && (
          <div className="formSearch d-lg-block d-none">
            <i>
              <Icon icon="ion:search-outline" />
            </i>
            <input
              className="form-control"
              placeholder="Search"
              onChange={(e) =>
                props.search ? props.search(e.target.value) : {}
              }
            />
          </div>
        )}
        <div className="ms-auto d-inline-flex">
          <div className="dropdown">
            <button
              type="button"
              className="user-info"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <div className="avatar">{image && <img src={image} />}</div>
              <div className="userName">{name}</div>
              <i>
                <Icon icon="ic:round-keyboard-arrow-down" />
              </i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  onClick={() => {
                    handleOpenModal();
                  }}
                  className="detailDrawer"
                >
                  My Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    navigate("/change-password", { replace: true });
                  }}
                >
                  Change Password
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    // window.location.reload(false)
                    navigate("/sign-in", { replace: true });
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>

          <button
            className="menuBtn d-xl-none d-inline-block"
            onClick={handleMenuOpen}
          >
            <Icon icon="charm:menu-hamburger" />
          </button>
        </div>
        <div
          className="drawerModal"
          id="profileDrawer"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">My Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleHideModal}
                ></button>
              </div>

              <div className="modal-body">
                {/* <div className="profile-img">
                  <img src={profileUrl} />
                </div> */}
                <div className="profile-img">
                  {image && <img src={image} alt={name} />}
                  <input
                    type="file"
                    hidden
                    id="profileImg"
                    name="profileImg"
                    className="uploadImg"
                    onChange={(e) => fileChange(e)}
                  />
                  <label htmlFor="profileImg">
                    <Icon icon="tabler:camera-selfie" />
                  </label>
                </div>

                <div className="info-card">
                  <div className="cardHead">
                    <div className="media-body">
                      <h3>{name}</h3>
                      <p>{designation}</p>
                    </div>
                  </div>

                  <div className="field-card">
                    <label>Email</label>
                    <p>{email}</p>
                  </div>
                  <div className="field-card">
                    <label>Contact Number</label>
                    <p>{phoneNumber}</p>
                  </div>
                  <div className="field-card">
                    <label>Job Start Date</label>
                    <p>{Moment(startDate).format("YYYY-MM-DD")}</p>
                  </div>
                  <div className="field-card">
                    <label>Job End Date</label>
                    <p>{Moment(endDate).format("YYYY-MM-DD")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
