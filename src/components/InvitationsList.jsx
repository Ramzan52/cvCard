import moment from 'moment';
import React, { useState } from 'react';
import { useEffect } from 'react';
import SimpleBar from 'simplebar-react';

function InvitationsList(props) {
  const { data, selectionChange, status } = props;

  const [selectedEmployees, setSelectedEmployees] = useState([]);


  const selectEmployee = (id, checked) => {
    const idx = selectedEmployees.indexOf(id);
    const selection = [...selectedEmployees];

    if (checked) {
      if (idx === -1) {
        data.forEach(element => {
          if (element.id === id) {
            element.isActive = true;
          }
        });
        selection.push(id);
        setSelectedEmployees(selection);
      }
    } else if (idx !== -1) {
      data.forEach(element => {
        if (element.id === id) {
          element.isActive = false;
        }
      });
      selection.splice(idx, 1);
      setSelectedEmployees(selection);
    }

    selectionChange(selection);
  };
  const selectAllEmployee = (checked) => {

    let selection = [];

    if (checked) {
      data.forEach(element => {
        element.isActive = true;
        selection.push(element.id);
        setSelectedEmployees(selection);

      });
    }



    else {
      data.forEach(element => {
        element.isActive = false;


      });
      selection = [];
      setSelectedEmployees(selection);
    }

    selectionChange(selection);
  };
  useEffect(() => {
    setSelectedEmployees([]);
    data.forEach(element => {
      element.isActive = false;
      

    });
  }, [data]);
  
  return (
    <SimpleBar className="card-table">
      <div className="table-responsive custom-table">
        <table className="table">
          <thead>
            <tr>
              {status !== 'Active' && <th> <th>
                <input
                  type="checkbox"
                  id="id"
                  className="checkbox-style-rounded"
                  onClick={(e) => selectAllEmployee(e.target.checked)}
                />
                <label htmlFor="id">
                  <i>
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                      <circle
                        className="path circle"
                        fill="none"
                        strokeWidth="6"
                        strokeMiterlimit="10"
                        cx="65.1"
                        cy="65.1"
                        r="62.1"
                      ></circle>
                      <polyline
                        className="path check"
                        fill="none"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-miterlimit="10"
                        points="100.2,40.2 51.5,88.8 29.8,67.5 "
                      ></polyline>
                    </svg>
                  </i>
                </label> </th></th>}

              <th>Name</th>
              <th>Email</th>
              {status !== 'Inactive' && <th>Invited On</th>}
            </tr>
          </thead>

          <tbody>
            {data.map((invitation) => {
              const { id, email, employeeEmail, employeeName, name, sentOn } = invitation;

              return (
                <tr key={`row_${id}`}>
                  {status !== 'Active' && (
                    <td>
                      <input
                        type="checkbox"
                        id={id}
                        className="checkbox-style-rounded"
                        onClick={(e) => selectEmployee(id, e.target.checked)}
                        checked={invitation.isActive}
                      />
                      <label htmlFor={id}>
                        <i>
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                            <circle
                              className="path circle"
                              fill="none"
                              strokeWidth="6"
                              strokeMiterlimit="10"
                              cx="65.1"
                              cy="65.1"
                              r="62.1"
                            ></circle>
                            <polyline
                              className="path check"
                              fill="none"
                              stroke-width="6"
                              stroke-linecap="round"
                              stroke-miterlimit="10"
                              points="100.2,40.2 51.5,88.8 29.8,67.5 "
                            ></polyline>
                          </svg>
                        </i>
                      </label>
                    </td>
                  )}
                  <td>{employeeName || name}</td>
                  <td>{employeeEmail || email}</td>
                  {status !== 'Inactive' && <td>{(sentOn && moment(sentOn[sentOn.length - 1]).format('DD/MM/yyyy')) || 'N/A'}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </SimpleBar>
  );
}

export default InvitationsList;
