import { Icon } from '@iconify/react';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import InvitationsList from '../components/InvitationsList';
import Topbar from '../components/Topbar';
import { api } from '../services/api-service';
import notificationSvc from '../services/notification-service';

const Invitation = () => {
  const selectedEmployees = useRef([]);
  const searchTimeout = useRef(0);

  const [invitations, setInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('Active');
  const [searchText, setSearchText] = useState('');

  const getInvitations = async () => {
    setIsLoading(true);

    const response = await api.get(`Invitations?pageNumber=${pageNumber}&pageSize=50&status=${selectedStatus}&search=${searchText}`);;
    setIsLoading(false);
    if (response && response.ok) {
      setInvitations(response.data.list);
    }
  };

  const sendInvitation = async () => {
    if (selectedEmployees.current.length === 0) {
      notificationSvc.warning('Please select employees to send invitation');
      return;
    }

    const data = selectedEmployees.current.map(employeeId => ({ employeeId }));
    const response = await api.post(`Invitations`, data);

    if (response.ok) {
      notificationSvc.success('Invitation sent successfully');
      getInvitations();
    }
  };
  const search = async (value) => {
    setSearchText(value);
  };
  
  useEffect(() => {
    fetchInvitation();
  }, [selectedStatus]);

  const fetchInvitation = () => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => getInvitations(), 500);
  }

  let bannerClassName;
  switch (selectedStatus) {
    case 'Inactive':
      bannerClassName = 'danger';
      break;

    case 'Pending':
      bannerClassName = 'warning';
      break;

    default:
      bannerClassName = 'success';
      break;
  }
  useMemo(() => {
    fetchInvitation();
  }, [searchText]);
  return (
    <>
      <div className="main">
        <Topbar showSearch={true} search={search} />
        <div className="card-main">
          <div className="cardHeader">
            <h3>Invitations </h3>
            <div className="headerCTA">
              {selectedStatus !== 'Active' && (
                <div className="invitationLink">
                  <button className="btn cta-secondary me-4" onClick={sendInvitation}>
                    <i>
                      <Icon icon="bi:send" />
                    </i>{' '}
                    <span>Send Invitation</span>
                  </button>
                </div>
              )}
              <ul className="nav nav-tabs cta-status" id="myTab" role="tablist">
                {['Active', 'Inactive', 'Pending'].map((status) => (
                  <li key={status} role="presentation">
                    <button
                      onClick={() => setSelectedStatus(status)}
                      className={`status${status} ${status === selectedStatus ? 'active' : ''}`}
                    >
                      {status}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {isLoading ? (
            <div className={`messageBody alert alert-bg text-center`}>Loading invitations</div>
          ) : invitations.length === 0 ? (
            <div className={`messageBody alert alert-bg text-center`}>
              No {selectedStatus} invitations found
            </div>
          ) : (
            <InvitationsList
              data={invitations}
              status={selectedStatus}
              pageChange={(val) => setPageNumber(val)}
              selectionChange={(val) => (selectedEmployees.current = val)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Invitation;
