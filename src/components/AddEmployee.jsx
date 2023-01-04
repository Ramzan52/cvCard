import { Icon } from "@iconify/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import ImageCropper from "./ImageCropper";

function AddEmployee({ afterSave, dismiss }) {
  const [changes, setChanges] = useState({});
  const [designation, setDesignation] = useState("");
  const [email, setEmail] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [errors, setErrors] = useState({});
  const [isContinue, setIsContinue] = useState(true);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [image, setImage] = useState();
  const [showCropper, setShowCropper] = useState(false);

  const addEmployee = async (e) => {
    e.preventDefault();
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var regex = /^[a-zA-Z ]*$/;

    if (!validateAddEmployee(true)) {
      return false;
    }
    if (!name.match(regex)) {
      notificationSvc.error("Please enter a valid name");
      return;
    }
    // if (!image) {
    //   notificationSvc.error("Please add profile image");
    //   return;
    // }
    if (!designation.match(regex)) {
      notificationSvc.error("Please enter a valid designation");
      return;
    }
    if (email.match(validRegex)) {
      const response = await api.post("Employees", {
        name,
        designation,
        email,
        phoneNumber,
        startDate,
        endDate,
        isContinue,
        profileUrl,
      });

      if (response.ok && response.data) {
        notificationSvc.success(" Employee is added successfully");
        afterSave();
      }
    } else {
      notificationSvc.error("Please enter a valid email");
      return;
    }
  };

  const uploadFile = useCallback(async (croppedImage) => {
    const formData = new FormData();
    formData.append("attachment", croppedImage);
    const response = await api.post("upload-attachments", formData);
    notificationSvc.success("Image uploaded successfully");
    setShowCropper(false);
    setProfileUrl(response.data);
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

  const validateAddEmployee = (isSubmitted) => {
    const err = {};
    let valid = true;

    if (!name && (changes.name || isSubmitted)) {
      err.name = true;
      valid = false;
    }

    if (!designation && (changes.designation || isSubmitted)) {
      err.designation = true;
      valid = false;
    }

    if (!email && (changes.email || isSubmitted)) {
      err.email = true;
      valid = false;
    }

    if (!phoneNumber && (changes.phoneNumber || isSubmitted)) {
      err.phoneNumber = true;
      valid = false;
    }

    setErrors(err);
    return valid;
  };

  useEffect(() => {
    document.body.classList.add("show-modal");

    return () => {
      document.body.classList.remove("show-modal");
    };
  }, []);

  useMemo(() => {
    validateAddEmployee();
  }, [name, designation, email, phoneNumber, changes]);

  return (
    <>
      <div
        className="modal fade modal-profile"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Employee</h5>
              <button
                type="button"
                className="btn-close"
                onClick={dismiss}
              ></button>
            </div>
            <form>
              <div className="modal-body">
                <div className="avatar-upload">
                  {profileUrl && <img src={profileUrl} alt={name} />}
                  <input
                    type="file"
                    hidden
                    id="uploadImg"
                    name="uploadImg"
                    className="uploadImg"
                    onChange={(e) => fileChange(e)}
                  />
                  <label htmlFor="uploadImg">
                    <Icon icon="tabler:camera-selfie" />
                  </label>
                </div>

                {showCropper && (
                  <div style={{ width: "100%" }}>
                    <ImageCropper image={image} uploadFile={uploadFile} />
                  </div>
                )}

                {!showCropper && (
                  <div className="row">
                    <div
                      className={`col-lg-6 ${errors.name ? "has-error" : ""}`}
                    >
                      <div className="mb-4">
                        <label>Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter name"
                          value={name}
                          required
                          onChange={(e) => {
                            setName(e.target.value);
                            setChanges((changes) => ({
                              ...changes,
                              name: true,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`col-lg-6 ${
                        errors.designation ? "has-error" : ""
                      }`}
                    >
                      <div className="mb-4">
                        <label>Designation *</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Designation"
                          value={designation}
                          required
                          onChange={(e) => {
                            setDesignation(e.target.value);
                            setChanges((changes) => ({
                              ...changes,
                              designation: true,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`col-lg-6 ${errors.email ? "has-error" : ""}`}
                    >
                      <div className="mb-4">
                        <label>Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter Email"
                          value={email}
                          required
                          onChange={(e) => {
                            setEmail(e.target.value);
                            setChanges((changes) => ({
                              ...changes,
                              email: true,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div
                      className={`col-lg-6 ${
                        errors.phoneNumber ? "has-error" : ""
                      }`}
                    >
                      <div className="mb-4">
                        <label>Contact Number *</label>

                        <PhoneInput
                          placeholder="Enter phone number"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e);
                            setChanges((changes) => ({
                              ...changes,
                              phoneNumber: true,
                            }));
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-4">
                        <label>Start Date</label>

                        <div className="icon-field">
                          <DatePicker
                            className="form-control"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            placeholderText="dd/mm/yyyy"
                            dateFormat="dd/MM/yyyy"
                            monthsShown={1}
                            showYearDropdown
                            fixedHeight
                          />

                          <i>
                            <Icon icon="ph:calendar-blank" />
                          </i>
                        </div>
                      </div>
                    </div>
                    {!isContinue && (
                      <div className="col-lg-6">
                        <div className="mb-4">
                          <label>End Date</label>
                          <div className="icon-field">
                            <DatePicker
                              className="form-control"
                              selected={endDate}
                              onChange={(date) => setEndDate(date)}
                              placeholderText="dd/mm/yyyy"
                              dateFormat="dd/MM/yyyy"
                              monthsShown={1}
                              showYearDropdown
                              fixedHeight
                              minDate={startDate}
                            />
                            <i>
                              <Icon icon="ph:calendar-blank" />
                            </i>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-lg-12">
                      <div className="mb-4">
                        <div className="custom-check">
                          <input
                            type="checkbox"
                            id="check1"
                            className="checkbox-style"
                            checked={isContinue}
                            onChange={(e) => {
                              setIsContinue(e.target.checked);
                              if (e.target.checked) {
                                setEndDate(null);
                              }
                            }}
                          />
                          <label htmlFor="check1">
                            <span>Continue</span>{" "}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!showCropper && (
                <div className="modalFooter">
                  <button
                    className="btn btn-dark w-100"
                    type="submit"
                    onClick={addEmployee}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddEmployee;
