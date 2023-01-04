import { Icon } from "@iconify/react";
import React, { useState } from "react";
import AddEmployee from "../components/AddEmployee";
import AddEmployees from "../components/AddEmployees";
import EmployeesList from "../components/EmployeesList";
import Topbar from "../components/Topbar";

import SimpleBar from "simplebar-react";
import { Modal, Button } from "react-bootstrap";
const statuses = ["All", "Active", "Inactive"];

const Employees = () => {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [empStatus, setEmpStatus] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [searchText, setSearchText] = useState("");
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showAddEmployeesModal, setShowAddEmployeesModal] = useState(false);

  const addEmployee_Click = () => {
    setShowAddEmployeeModal(true);
  };

  const search = async (value) => {
    setSearchText(value);
  };

  return (
    <>
      <div className="main">
        <Topbar showSearch={true} search={search} />
        <div className="card-main">
          <div className="cardHeader py-2">
            <h3>Employees </h3>
            <div className="headerCTA">
              <ul className="employeCTA">
                <li>
                  <button
                    className="btn cta-secondary "
                    onClick={addEmployee_Click}
                  >
                    <i>
                      <Icon icon="carbon:user" />
                    </i>
                    <span>Add Employee</span>
                  </button>
                </li>
                <li>
                  <button
                    className="btn cta-secondary"
                    onClick={() => setShowAddEmployeesModal(true)}
                  >
                    <i>
                      <Icon icon="carbon:user-multiple" />
                    </i>
                    <span>Add Employees</span>
                  </button>
                </li>
              </ul>

              <ul className="nav nav-tabs tabs-link">
                {statuses.map((status) => (
                  <li key={`link_${status}`}>
                    <button
                      className={`btn ${empStatus === status ? "active" : ""}`}
                      type="button"
                      role="tab"
                      onClick={() => setEmpStatus(status)}
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <EmployeesList
            searchText={searchText}
            status={empStatus}
            lastUpdated={lastUpdated}
          />
        </div>
      </div>

      {showAddEmployeeModal && (
        <AddEmployee
          afterSave={() => {
            setShowAddEmployeeModal(false);
            setLastUpdated(Date.now());
          }}
          dismiss={() => setShowAddEmployeeModal(false)}
        />
      )}

      {showAddEmployeesModal && (
        <AddEmployees
          afterSave={() => {
            setShowAddEmployeesModal(false);
            setLastUpdated(Date.now());
          }}
          dismiss={() => setShowAddEmployeesModal(false)}
        />
      )}
    </>
  );
};

export default Employees;
