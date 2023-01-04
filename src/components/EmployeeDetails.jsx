import { Icon } from "@iconify/react";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import Brands from "../assets/images/brand1.png";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import AddDesignation from "./AddDesignation";
import EditDesignation from "./EditDesignation";
import EditEmployee from "./EditEmployee";
import ImageCropper from "./ImageCropper";
import PlaceholderProfile from "../assets/images/placeholder-profile.png";

function EmployeeDetails(props) {
  const { afterSave, data, hideDetails, updateProfileUrl } = props;

  const { id: empId, userId } = data;

  const [designations, setDesignations] = useState([]);
  const [editDesignation, setEditDesignation] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [employee, setEmployee] = useState({});
  const [showAddDesignationModal, setShowAddDesignationModal] = useState(false);
  const [image, setImage] = useState();
  const [showCropper, setShowCropper] = useState(false);
  const [imageError, setImageError] = useState(false);

  const addDesignation_Closed = () => {
    setShowAddDesignationModal(false);
    getDesignations();
  };

  const editDesignation_Closed = () => {
    setEditDesignation(null);
    getDesignations();
  };

  const getDesignations = async () => {
    const response = await api.get(`emp-designations/employee/${empId}`);
    if (response.ok) {
      setDesignations(response.data);
    }
  };

  const refreshEmployeeDetails = async () => {
    const response = await api.get(`employees/${empId}`);

    if (response.ok) {
      setEmployee(response.data);
    }
  };

  const updateProfilePic = useCallback(async (croppedImage) => {
    const formData = new FormData();

    formData.append("attachment", croppedImage);
    const res = await api.post("upload-attachments", formData);

    if (res.ok) {
      const response = await api.put(
        `Employees/update-profile-image/${empId}`,
        res.data
      );

      if (response.ok) {
        setShowCropper(false);
        notificationSvc.success("Employee details are updated successfully");

        setEmployee({
          ...employee,
          profileUrl: res.data,
        });

        updateProfileUrl(empId, res.data);
      }
    }
  }, []);

  const fileChange = (e) => {
    if (
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpeg"
    ) {
      let files;
      if (e.dataTransfer) {
        files = e.dataTransfer.files;
      } else if (e.target) {
        files = e.target.files;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(files[0]);
    } else {
      return notificationSvc.error("Please upload valid image format.");
    }
  };

  useEffect(() => {
    document.body.classList.add("open_modal");

    return () => {
      document.body.classList.remove("open_modal");
    };
  }, []);

  const onImageError = useCallback((currentTarget) => {
    if (currentTarget.src !== "../images/placeholder-profile.png")
      currentTarget.src = "../images/placeholder-profile.png";
  }, []);

  useMemo(() => {
    setEmployee(data);
    getDesignations();
  }, [data]);

  const {
    designation,
    email,
    endDate,
    isContinue,
    name,
    phoneNumber,
    profileUrl,
    startDate,
  } = employee;

  return (
    <>
      <div id="detailDrawer" className="drawerModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Profile</h5>
              <button
                type="button"
                className="btn-close"
                onClick={hideDetails}
              ></button>
            </div>

            <SimpleBar className="modal-body">
              <div className="profile-img">
                {imageError && <img src={PlaceholderProfile} />}
                {!imageError && (
                  <img src={profileUrl} onError={() => setImageError(true)} />
                )}
                <input
                  type="file"
                  hidden
                  id="uploadImg"
                  name="uploadImg"
                  className="uploadImg"
                  onChange={(e) => {
                    fileChange(e);
                  }}
                />
                <label htmlFor="uploadImg">
                  <Icon icon="codicon:device-camera" />
                </label>
              </div>
              {showCropper && (
                <div style={{ width: "100%" }}>
                  <ImageCropper image={image} uploadFile={updateProfilePic} />
                </div>
              )}

              {!showCropper && (
                <div className="info-card">
                  <div className="cardHead">
                    <div className="media-body">
                      <h3>{name}</h3>
                      <p>{designation}</p>
                    </div>
                    <Link to="#" onClick={() => setEditEmployee(employee)}>
                      <i>
                        <Icon icon="fluent:edit-24-regular" />
                      </i>
                    </Link>
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
                    <p>{moment(startDate).format("DD-MMM-YYYY")}</p>
                  </div>
                  <div className="field-card">
                    <label>Job End Date</label>
                    <p>
                      {!isContinue
                        ? moment(endDate).format("DD-MMM-YYYY")
                        : "Continue"}
                    </p>
                  </div>
                  <div className="designation">
                    <div className="media-body">
                      <h2>Designations</h2>
                    </div>
                    <Link
                      to="#"
                      className="cta-icon-small"
                      onClick={() => setShowAddDesignationModal(true)}
                    >
                      <i>
                        <Icon icon="eva:plus-fill" />
                      </i>
                    </Link>
                  </div>
                  {designations.map((designation) => (
                    <div
                      key={`designation_${designation.id}`}
                      className="designation-cards"
                    >
                      <div className="brand">
                        <img src={Brands} alt="" />
                      </div>
                      <div className="media-body">
                        <h4>{designation.title}</h4>
                        <p>
                          {" "}
                          {moment(designation.startDate).format(
                            "YYYY-MM-DD"
                          )} -{" "}
                          {designation.endDate
                            ? moment(designation.endDate).format("YYYY-MM-DD")
                            : "Till date"}
                        </p>
                      </div>
                      <Link
                        to="#"
                        onClick={() => setEditDesignation(designation)}
                      >
                        <i>
                          <Icon icon="fluent:edit-24-regular" />
                        </i>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </SimpleBar>
          </div>
        </div>
      </div>

      {editEmployee && (
        <EditEmployee
          data={editEmployee}
          afterSave={() => {
            setEditEmployee(null);
            refreshEmployeeDetails();
            afterSave();
          }}
          dismiss={() => setEditEmployee(null)}
        />
      )}

      {editDesignation && (
        <EditDesignation
          data={editDesignation}
          close={editDesignation_Closed}
        />
      )}

      {showAddDesignationModal && (
        <AddDesignation
          employeeId={empId}
          userId={userId}
          close={addDesignation_Closed}
        />
      )}
    </>
  );
}

export default EmployeeDetails;
