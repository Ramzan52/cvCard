import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { useMemo } from "react";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
function EditEmployee(props) {
  const { afterSave, dismiss, data } = props;
  const { id } = data;
  const [changes, setChanges] = useState({});

  const [designation, setDesignation] = useState(data.designation);
  const [email, setEmail] = useState(data.email);
  const [endDate, setEndDate] = useState(
    !data.isContinue && data.endDate ? new Date(data.endDate) : null
  );
  const [errors, setErrors] = useState({});
  const [isBlocked, setIsBlocked] = useState(data.isBlocked);
  const [isContinue, setIsContinue] = useState(data.isContinue);
  const [name, setName] = useState(data.name);
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber);
  const [profileUrl, setProfile] = useState(data.profileUrl);
  const [startDate, setStartDate] = useState(
    data.startDate ? new Date(data.startDate) : null
  );

  const updateEmployee = async (e) => {
    e.preventDefault();
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    var regex = /^[a-zA-Z ]*$/;

    if (!validateEditEmployee()) {
      return;
    }
    if (!name.match(regex)) {
      notificationSvc.error("Please enter a valid name");
      return;
    }
    if (!designation.match(regex)) {
      notificationSvc.error("Please enter a valid designation");
      return;
    }
    if (!email.match(validRegex)) {
      notificationSvc.error("Please enter a valid email");
      return;
    }

    // if (!profileUrl) {
    //   notificationSvc.error("Please add profile image");
    //   return;
    // }
    const response = await api.put("Employees", {
      id,
      name,
      designation,
      email,
      phoneNumber,
      startDate,
      endDate,
      isContinue,
      isBlocked,
      profileUrl,
    });

    if (response.ok) {
      notificationSvc.success("Employee is updated successfully");

      afterSave();
      dismiss();
    }
  };

  const validateEditEmployee = (isSubmitted) => {
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
    validateEditEmployee();
  }, [name, designation, email, phoneNumber]);

  return (
    <div className="modal fade modal-profile">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={dismiss}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className={`col-lg-6 ${errors.name ? "has-error" : ""}`}>
                <div className="mb-4">
                  <label>Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={name}
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
                className={`col-lg-6 ${errors.designation ? "has-error" : ""}`}
              >
                <div className="mb-4">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Designation"
                    value={designation}
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
              <div className={`col-lg-6 ${errors.email ? "has-error" : ""}`}>
                <div className="mb-4">
                  <label>Email</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Email"
                    value={email}
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
                className={`col-lg-6 ${errors.phoneNumber ? "has-error" : ""}`}
              >
                <div className="mb-4">
                  <label>Contact Number</label>

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
              <div className="col-lg-12">
                <div className="mb-4">
                  <label>Select Status</label>
                  <div className="swiched-label">
                    <input
                      type="checkbox"
                      id="switchBtn1"
                      name="switchBtn"
                      className="switch-style-1"
                      checked={isBlocked}
                      onChange={(e) => {
                        setIsBlocked(e.target.checked);
                        console.log(e.target.checked);
                      }}
                    />
                    <label htmlFor="switchBtn1">
                      <span className="text active">Active</span>
                      <span className="text block">Blocked</span>
                      <span className="bg"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modalFooter">
            <button
              className="btn btn-dark w-100"
              type="submit"
              onClick={updateEmployee}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditEmployee;
