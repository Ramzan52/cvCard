import { Icon } from "@iconify/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import SimpleBar from "simplebar-react";
import AvatarName from "../components/AvatarName";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import EmployeeDetails from "./EmployeeDetails";

function EmployeesList(props) {
  const { searchText, status } = props;

  const searchTimeout = useRef(0);

  const [employees, setEmployees] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(props.lastUpdated);
  const [page, setPage] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    searchEmployees();
  }, [lastUpdated]);
  useEffect(() => {
    searchEmployees();
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(1);
  }, [status]);
  useEffect(() => {
    setPageNumber(1);
    searchEmployees();
  }, [searchText]);
  const blockEmployee = async (id) => {
    const response = await api.put(`Employees/block/${id}`);

    if (response.ok) {
      notificationSvc.success("Employee is blocked successfully");
      setIsBlocked(id, true);
    }
  };

  const searchEmployees = () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => getEmployees(), 500);
  };

  const getEmployees = async () => {
    let url = `Employees?pageNumber=${pageNumber}&pageSize=21&search=${searchText}`;
    if (status !== "All") {
      url += `&status=${status}`;
    }

    setIsFetching(true);
    const response = await api.get(url);
    setIsFetching(false);

    if (response && response.ok) {
      setEmployees(response.data.list);
      setPage(response.data.totalPages);
    }
  };

  const setIsBlocked = (empId, isBlocked) => {
    const empList = [...employees];
    const idx = employees.findIndex((x) => x.id === empId);

    if (status === "All") {
      const emp = { ...empList[idx] };
      emp.isBlocked = isBlocked;
      empList[idx] = emp;
    } else {
      empList.splice(idx, 1);
    }

    setEmployees(empList);
  };

  const unblockEmployee = async (id) => {
    const response = await api.put(`Employees/unblock/${id}`);

    if (response.ok) {
      notificationSvc.success("Employee is unblocked successfully");
      setIsBlocked(id, false);
    }
  };

  const updateProfileUrl = (id, profileUrl) => {
    const list = [...employees];
    const idx = list.findIndex((x) => x.id === id);
    list[idx] = {
      ...list[idx],
      profileUrl,
    };

    setEmployees(list);
  };

  useMemo(() => {
    setPage(1);
    searchEmployees();
  }, [lastUpdated, searchText, status]);

  return (
    <>
      <div className="card-filter">
        <SimpleBar className="contentCardWrapper">
          <div className="innerContent">
            <div className="row">
              {isFetching ? (
                <div className={`messageBody alert alert-bg text-center`}>
                  Loading employees
                </div>
              ) : employees.length === 0 ? (
                <div className={`messageBody alert alert-bg text-center`}>
                  No {status !== "All" ? status : ""} employees found
                </div>
              ) : (
                employees.map((employee) => (
                  <div key={employee.id} className="col-xl-4 col-md-6">
                    <div className="card-user">
                      <div className="media">
                        <div className="avatar">
                          <AvatarName
                            displayName={employee.name}
                            displayPicture={employee.profileUrl}
                          />
                        </div>
                        <div className="media-body">
                          <h3>{employee.name}</h3>
                          <p>{employee.designation}</p>
                          <div className="email">
                            <i>Email</i> <span>{employee.email}</span>
                          </div>
                        </div>
                      </div>

                      <div className="card-user-footer">
                        <ul>
                          <li>
                            {!employee.isBlocked ? (
                              <button
                                className="btn btn-outline-dark"
                                onClick={() => blockEmployee(employee.id)}
                              >
                                Block
                              </button>
                            ) : (
                              <button
                                className="btn btn-outline-dark"
                                onClick={() => unblockEmployee(employee.id)}
                              >
                                Unblock
                              </button>
                            )}
                          </li>
                          <li>
                            <button
                              className="btn btn-dark detailDrawer"
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              Details
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <nav>
            <ul className="pagination justify-content-center">
              <li className="prev disabled">
                <button hidden={pageNumber === 1}>
                  <Icon
                    icon="eva:arrow-ios-back-fill"
                    onClick={(i) => {
                      setPageNumber(pageNumber - 1);
                    }}
                  />
                </button>
              </li>
              {Array(page)
                .fill()
                .map(
                  (_, i) =>
                    page > 1 && (
                      <li key={`page_${i}`}>
                        <button
                          className={`${pageNumber === i + 1 ? "active" : ""}`}
                          onClick={(i) => {
                            setPageNumber(parseInt(i.target.innerHTML));
                          }}
                        >
                          {i + 1}
                        </button>
                      </li>
                    )
                )}
              <li className="next">
                <button
                  hidden={page === pageNumber || page === 0 || page === 1}
                >
                  <Icon
                    icon="eva:arrow-ios-forward-fill"
                    onClick={(i) => {
                      setPageNumber(pageNumber + 1);
                    }}
                  />
                </button>
              </li>
            </ul>
          </nav>
        </SimpleBar>
      </div>

      {selectedEmployee && (
        <EmployeeDetails
          data={selectedEmployee}
          afterSave={() => setLastUpdated(Date.now())}
          hideDetails={() => setSelectedEmployee(null)}
          updateProfileUrl={updateProfileUrl}
        />
      )}
    </>
  );
}

export default EmployeesList;
