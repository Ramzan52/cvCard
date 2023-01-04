import { Icon } from "@iconify/react";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import SimpleBar from "simplebar-react";
import { Modal, Button } from "react-bootstrap";
import Brand from "../assets/images/brand1.png";
import ImageCropper from "./ImageCropper";
const EMPTY_LIST = "Selected employees list is empty";
const INVALID_TEMPLATE = "Selected employees list is not a valid template";

function AddEmployees(props) {
  const { afterSave, dismiss } = props;

  const [employeesList, setEmployeesList] = useState([]);
  const [fileName, setFileName] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const [image, setImage] = useState();
  const [showCropper, setShowCropper] = useState(false);
  const [email, setEmail] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);

    return `${dateInfo.getFullYear()}-${`${dateInfo.getMonth() + 1}`.padStart(
      2,
      "0"
    )}-${`${dateInfo.getDate()}`.padStart(2, "0")}`;
  };

  const handleBulkFileUpload = (e) => {
    e.preventDefault();

    if (!e.target.files || e.target.files.length === 0) {
      notificationSvc.warning("Employees list is not selected");
      setDisabled(true);
      return;
    }

    setFileName(e.target.files[0].name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      try {
        let data = XLSX.utils.sheet_to_json(worksheet);

        if (data.length === 0) {
          notificationSvc.error(EMPTY_LIST);
          return;
        }

        const errorMessage = validateEmployeesData(data);
        if (errorMessage) {
          notificationSvc.error(errorMessage);
          return;
        }

        data = data.map((x) => ({
          ...x,
          PhoneNumber: x.PhoneNumber.toLocaleString(),
          StartDate: x.StartDate && excelDateToJSDate(x.StartDate),
          EndDate: x.EndDate && excelDateToJSDate(x.EndDate),
          ProfileUrl: "wwww",
        }));

        setDisabled(false);
        setEmployeesList(data);
        setShow(true);
      } catch {
        notificationSvc.error(INVALID_TEMPLATE);
      }
    };

    reader.readAsArrayBuffer(e.target.files[0]);
  };

  const uploadEmployeesList = async () => {
    const response = await api.post("Employees/add-list", employeesList);

    if (response.ok && response.data) {
      notificationSvc.success(" Employees are added successfully");
      handleClose();
      afterSave();
    }
  };

  const uploadBulkImg = async (croppedImage, email) => {
    const formData = new FormData();
    formData.append("attachment", croppedImage);

    const response = await api.post("upload-attachments", formData);
    if (response) {
      const updatedEmployeeList = employeesList.map((emp) => {
        const employee = { ...emp };
        if (employee.Email === email) {
          employee.ProfileUrl = response.data;
        }
        return employee;
      });
      setShowCropper(false);
      setShow(true);
      setEmployeesList(updatedEmployeeList);
    } else {
      return notificationSvc.error("Please upload valid image format.");
    }
  };

  const fileChange = (e, email) => {
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
        setEmail(email);
        setImage(reader.result);
        setShowCropper(true);
        setShow(false);
      };
      reader.readAsDataURL(files[0]);
    } else {
      return notificationSvc.error("Please upload valid image format.");
    }
  };

  const validateEmployeesData = (data) => {
    let invalidData = [];
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    data.forEach((item) => {
      if (!item.Name) {
        invalidData.push("Name");
      }

      if (!item.Email) {
        invalidData.push("Email");
      }

      if (!item.Email.match(validRegex)) {
        invalidData.push("Email");
      }

      if (!item.Designation) {
        invalidData.push("Designation");
      }

      if (!item.PhoneNumber) {
        invalidData.push("Phone number");
      }

      if (!item.StartDate) {
        invalidData.push("Start date");
      }
      if (item.StartDate && typeof item.StartDate !== "number") {
        invalidData.push("Start date");
      }
      if (item.EndDate && typeof item.EndDate !== "number") {
        invalidData.push("Start date");
      }
    });

    if (invalidData.length === 0) {
      return "";
    }

    invalidData = Array.from(new Set(invalidData));
    return `Following fields' data is invalid: ${invalidData.join(", ")}`;
  };

  useEffect(() => {
    document.body.classList.add("show-modal");

    return () => {
      document.body.classList.remove("show-modal");
    };
  }, []);

  return (
    <div className="modal fade modal-profile" tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Employees</h5>
            <button
              type="button"
              className="btn-close"
              onClick={dismiss}
            ></button>
          </div>

          {showCropper && (
            <div style={{ width: "100%" }}>
              <ImageCropper
                image={image}
                uploadFile={uploadBulkImg}
                email={email}
              />
            </div>
          )}

          {!showCropper && (
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-6">
                  <div className="mb-4">
                    <div>
                      <a
                        className="btn cta-primary"
                        href={`https://a360cvcarddev.blob.core.windows.net/templates/Employees.xlsx?time=${Date.now()}`}
                      >
                        <i>
                          <Icon icon="fluent:contact-card-48-regular" />
                        </i>
                        Download Template
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-4">
                    <div>
                      <input
                        type="file"
                        id="uploadCSV"
                        accept=".csv,.xlsx,.xls"
                        hidden
                        onChange={handleBulkFileUpload}
                        className="fileUpload"
                      />
                      <label
                        htmlFor="uploadCSV"
                        className="ctaAction curser-pointer btn cta-primary "
                      >
                        <i>
                          <Icon icon="uiw:file-excel" />
                        </i>
                        Upload List
                      </label>
                    </div>
                  </div>
                  <div className="mb-2">
                    {fileName !== "" && (
                      <label style={{ paddingLeft: "20px" }}>
                        <strong>File Name:</strong>
                        <span style={{ color: "#F76588" }}>{fileName}</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        className="employeesModal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-0">
          <SimpleBar className="mediaList">
            <ul>
              {employeesList.map((emp) => {
                const { Name, Email } = emp;

                return (
                  <li key={Email}>
                    <div className="media-body">
                      <div className="images-avatar">
                        <img
                          src={emp.ProfileUrl ? emp.ProfileUrl : Brand}
                          alt=""
                        />
                        <input
                          type="file"
                          hidden
                          id={`uploadImg_${Email}`}
                          className="uploadImg"
                          onChange={(e) => {
                            fileChange(e, Email);
                          }}
                        />
                        <label htmlFor={`uploadImg_${Email}`}>
                          <Icon icon="codicon:device-camera" />
                        </label>
                      </div>
                      <div className="name">{Name}</div>
                    </div>
                    <div className="email">{Email}</div>
                  </li>
                );
              })}
            </ul>
          </SimpleBar>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn cta-primary" onClick={uploadEmployeesList}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default AddEmployees;
