import React from 'react';
import { NavLink } from 'react-router-dom';
import Logo from '../assets/images/logo.png';
import Iconcard from '../assets/images/cards.svg';
import IconEmployee from '../assets/images/user.svg';
import IconInvitation from '../assets/images/invitation.svg';
import IconSetting from '../assets/images/setting.svg';
const Sidebar = () => {
  const handleMenuHide = () => {
    let body = document.body;
    body.className = '';
  };
  return (
    <>
      <div className="overlay" onClick={handleMenuHide}></div>
      <div className="sidebar">
        <div className="brand_name">
          <NavLink to="#">
            <img src={Logo} alt="" />
          </NavLink>
        </div>
        <ul className="navigation-sidebar">
          <li>
            {' '}
            <NavLink to="/">
              {' '}
              <i>
                <img src={Iconcard} alt="" />
              </i>{' '}
              <span>Cards</span>
            </NavLink>
          </li>
          <li>
            {' '}
            <NavLink to="/employees">
              <i>
                <img src={IconEmployee} alt="" />
              </i>{' '}
              <span>Employees</span>
            </NavLink>
          </li>
          <li>
            {' '}
            <NavLink to="/invitations">
              <i>
                <img src={IconInvitation} alt="" />
              </i>{' '}
              <span>Invitations</span>
            </NavLink>
          </li>
          <li>
            {' '}
            <NavLink to="/settings">
              <i>
                <img src={IconSetting} alt="" />
              </i>{' '}
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
