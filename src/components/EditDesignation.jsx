import { Icon } from "@iconify/react";
import React, { useState, useMemo } from "react";
import { useEffect } from "react";
import DatePicker from "react-datepicker";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";

function EditDesignation(props) {
  const { close, data } = props;
  const { startDate, title } = data;

  const [isContinue, setIsContinue] = useState(data.isContinue);
  const [endDate, setEndDate] = useState(
    data.endDate ? new Date(data.endDate) : null
  );
  const [changes, setChanges] = useState({});
  const [errors, setErrors] = useState({});
  const editEmployeeDesignation = async () => {
    if (!validateEditDesignation(true)) {
      return false;
    }
    const response = await api.put("emp-designations", {
      ...data,
      endDate,
      isContinue,
    });

    if (response.ok && response.data) {
      notificationSvc.success("Designation is updated successfully");
      close();
    }
  };
  const validateEditDesignation = (isSubmitted) => {
    const err = {};
    let valid = true;

    if (!endDate && isContinue === false && (changes.endDate || isSubmitted)) {
      err.endDate = true;
      valid = false;
    }

    setErrors(err);
    return valid;
  };
  useMemo(() => {
    validateEditDesignation();
  }, [endDate, isContinue]);
  useEffect(() => {
    document.body.classList.add("show-modal");

    return () => {
      document.body.classList.remove("show-modal");
    };
  });

  return (
    <div
      className="modal fade  modal-profile"
      id="EditDesignation"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Designation</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => close()}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="mb-4">
                  <label>Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={title}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-lg-6">
                <div className="mb-4">
                  <label>Start Date</label>

                  <div className="icon-field">
                    <DatePicker
                      className="form-control"
                      selected={new Date(startDate)}
                      readOnly
                      placeholderText="dd/mm/yyyy"
                      dateFormat="dd/MM/yyyy"
                      monthsShown={1}
                      showYearDropdown
                    />

                    <i>
                      <Icon icon="ph:calendar-blank" />
                    </i>
                  </div>
                </div>
              </div>
              {!isContinue && (
                <div
                  className={`col-lg-6 ${errors.endDate ? "has-error" : ""}`}
                >
                  <div className="mb-4">
                    <label>End Date</label>
                    <div className="icon-field">
                      <DatePicker
                        className="form-control"
                        selected={endDate}
                        minDate={new Date(startDate)}
                        onChange={(date) => setEndDate(date)}
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
              )}
              <div className="col-lg-12">
                <div className="mb-4">
                  <div className="custom-check">
                    <input
                      type="checkbox"
                      id="c"
                      className="checkbox-style"
                      checked={isContinue}
                      onChange={(e) => {
                        setIsContinue(e.target.checked);
                        setEndDate(null);
                      }}
                    />
                    <label htmlFor="c">
                      <span>Continue</span>{" "}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modalFooter">
            <button
              className="btn btn-dark w-100"
              onClick={(e) => {
                editEmployeeDesignation();
              }}
              data-bs-dismiss="modal"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditDesignation;
