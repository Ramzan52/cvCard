import { Icon } from '@iconify/react';
import React, { useState, useMemo } from 'react';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { api } from '../services/api-service';
import notificationSvc from '../services/notification-service';

function AddDesignation(props) {
  const { close, employeeId,userId } = props;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [isContinue, setIsContinue] = useState(true);
  const [title, setTitle] = useState('');
  const [changes, setChanges] = useState({});
  const [errors, setErrors] = useState({});

  const addDesignation = async (id) => {
    var regex = /^[a-zA-Z ]*$/;
    if (!validateAddDesignation(true)) {
      return false;
    }
    if (!(title.match(regex))){
      notificationSvc.error('Please enter a valid title');
      return;
    }
    const response = await api.post('emp-designations', {
      employeeId,
      userId,
      endDate,
      isContinue,
      startDate,
      title,
    });

    if (response.ok) {
      notificationSvc.success('Designation is added successfully');
      close();
    }
  };


  const validateAddDesignation = (isSubmitted) => {
    const err = {};
    let valid = true;

    if (!title && (changes.title || isSubmitted)) {
      err.title = true;
      valid = false;
    }

    if (!startDate && (changes.startDate || isSubmitted)) {
      err.startDate = true;
      valid = false;
    }

    if (!endDate && isContinue === false && (changes.endDate || isSubmitted)) {
      err.endDate = true;
      valid = false;
    }



    setErrors(err);
    return valid;
  }
  useMemo(() => {
    validateAddDesignation();
  }, [title, startDate, endDate, isContinue]);
  useEffect(() => {
    document.body.classList.add('show-modal');

    return () => {
      document.body.classList.remove('show-modal');
    };
  });

  return (
    <div className="modal fade in modal-profile" id="addDesignation" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Designation</h5>
            <button type="button" className="btn-close" onClick={() => close()}></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-lg-12">
                <div className={`col-lg-6 ${errors.title ? "has-error" : ""}`}>

                  <div className="mb-4">
                    <label>Designation</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter name "
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value)
                        setChanges(changes => ({
                          ...changes,
                          title: true
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>

                <div className={`col-lg-6 ${errors.startDate ? "has-error" : ""}`}>

                  <div className="mb-4">
                    <label>Start Date</label>

                    <div className="icon-field">
                      <DatePicker
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => {
                          setStartDate(date)
                          setChanges(changes => ({
                            ...changes,
                            startDate: true
                          }))
                        }}
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
                  <div className={`col-lg-6 ${errors.endDate ? "has-error" : ""}`}>

                    <div className="mb-4">
                      <label>End Date</label>
                      <div className="icon-field">
                        <DatePicker
                          className="form-control"
                          selected={endDate}
                          minDate={startDate}
                          onChange={(date) => {
                            setEndDate(date)
                            setChanges(changes => ({
                              ...changes,
                              endDate: true
                            }))
                          }}
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
                      <span>Continue</span>{' '}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modalFooter">
            <button
              className="btn btn-dark w-100"
              data-bs-dismiss="modal"
              onClick={() => addDesignation(props.employeeId)}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDesignation;
