import React, { useEffect, useState } from "react";
import SimpleBar from "simplebar-react";
import Select from "react-select";
import { Modal, Button } from "react-bootstrap";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import { Icon } from "@iconify/react";
import PlaceholderProfile from "../assets/images/placeholder-profile.png";

function TestUser(props) {
  const [option, setOption] = useState([]);
  const [testUser, setTestUser] = useState([]);
  const [user, setUser] = useState([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (props.show) {
      getEmployees();
    }
    if (props.id) {
      getCardTestUser();
    }
  }, [props.show]);
  const getEmployees = async () => {
    let employees = [];
    const response = await api.get(`Employees/unassigned-employees`);
    if (response && response.ok) {
      response.data.map((option) => {
        employees.push({
          label: option.name,
          value: option.id,
          profileUrl: option.profileUrl,
        });
      });
      setOption(employees);
    }
  };
  const addTestUser = () => {
    const selection = [...user];

    let existingId = selection.filter((id) => id.value === testUser.value);
    if (existingId.length === 0) {
      selection.push(testUser);
    }

    setUser(selection);
  };

  const getCardTestUser = async () => {
    let employees = [];

    const response = await api.get(
      `Employees/assigned-employees?testCardId=${props.id}`
    );
    if (response && response.ok) {
      response.data.map((option) => {
        employees.push({
          label: option.name,
          value: option.id,
        });
      });

      setUser(employees);
    }
  };
  const createTestUser = async () => {
    let id = [];
    user.map((user) => {
      id.push(user.value);
    });
    const response = await api.post(
      `Employees/assign-test-card?cardId=${props.id}`,
      id
    );
    if (response && response.ok) {
      props.handleClose();

      notificationSvc.success("test user assigned successfully");
      setUser([]);
      setTestUser([]);
    }
  };
  const removeAll = async () => {
    setUser([]);
    let id = [];

    const response = await api.post(
      `Employees/assign-test-card?cardId=${props.id}`,
      id
    );
    if (response && response.ok) {
      props.handleClose();

      notificationSvc.success("All test user remove successfully");
      setUser([]);
      setTestUser([]);
    }
  };
  const deleteUser = (id) => {
    let deletedUser = [];
    let deletedId = [];
    user.map((user) => {
      if (user.value !== id) {
        deletedUser.push(user);
        deletedId.push(user.value);
      }
    });
    setUser(deletedUser);
  };
  return (
    <div>
      <Modal
        className="drawerModal drawerTest"
        backdrop="static"
        show={props.show}
        onHide={props.handleClose}
        animation={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Test Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label>Select Employee</label>
          <div className="input-group">
            <div className="form-field">
              <Select
                options={option}
                onChange={(e) => {
                  setTestUser(e);
                }}
              />
            </div>
            <button
              className="btn btn-dark"
              onClick={() => {
                if (testUser.length !== 0) {
                  addTestUser();
                }
              }}
            >
              ADD
            </button>
          </div>

          <SimpleBar className="mediaTestscroll">
            <div className="mediaTestList">
              {user.map((employee) => (
                <div className="media">
                  <div className="avatar">
                    <img
                      src={
                        employee.profileUrl
                          ? employee.profileUrl
                          : PlaceholderProfile
                      }
                    />
                  </div>
                  <div className="media-body">
                    <div className="name">{employee.label}</div>
                  </div>
                  <button
                    className="cta-delete"
                    onClick={() => {
                      deleteUser(employee.value);
                    }}
                  >
                    <Icon icon="mi:delete"></Icon>
                  </button>
                </div>
              ))}
            </div>
          </SimpleBar>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <Button
            className="btn btn-dark"
            onClick={() => {
              removeAll();
            }}
          >
            Remove All
          </Button>
          <Button
            className="btn cta-primary"
            disabled={user.length === 0}
            onClick={() => {
              createTestUser();
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TestUser;
