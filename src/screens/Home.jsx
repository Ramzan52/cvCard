import { Icon } from "@iconify/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TestUser from "../components/TestUser";
import Topbar from "../components/Topbar";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";

const Home = () => {
  const [show, setShow] = useState(false);
  const [cardId, setCardId] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [cardDefinitions, setCardDefinitions] = useState([]);

  const changeActiveCard = async (selectedCard) => {
    if (selectedCard.fields.length <= 0) {
      return notificationSvc.error("please add fields before activating it");
    }
    if (selectedCard.isActive) {
      return;
    }

    const cards = cardDefinitions.map((x) => ({
      ...x,
      isActive: x.id === selectedCard.id,
    }));

    setCardDefinitions(cards);

    await api.put(`card-definitions/active?cardId=${selectedCard.id}`);
  };

  const deleteCard = async (id) => {
    const response = await api.delete(`card-definitions/${id}`);
    if (response.ok) {
      notificationSvc.success("Card is removed successfully");
      const cardDefs = [...cardDefinitions];
      const idx = cardDefs.findIndex((x) => x.id === id);
      cardDefs.splice(idx, 1);
      setCardDefinitions(cardDefs);
    }
  };

  const showCardDefinitions = async () => {
    const response = await api.get(`card-definitions`);
    if (response && response.ok) {
      setCardDefinitions(response.data);
    }
  };

  const uploadFile = async (e) => {
    const fileType = e.target.files[0]?.type;
    if (fileType !== "image/png" && fileType !== "image/jpeg") {
      notificationSvc.error("Please upload valid image format.");
      return;
    }

    const formData = new FormData();
    formData.append("attachment", e.target.files[0]);

    const response = await api.post("upload-attachments", formData);

    if (response.ok) {
      const res = await api.post("card-definitions", {
        templateName: "",
        isActive: false,
        backgroundImageUrl: response.data,
        fields: [],
      });

      if (res && res.ok) {
        notificationSvc.success("Card uploaded successfully");
        showCardDefinitions();
      }
    }
  };

  useEffect(() => {
    showCardDefinitions();
  }, []);

  return (
    <>
      <div className="main">
        <Topbar showSearch={false} />

        <div className="card-main">
          <h3>Cards</h3>
          <div className="cardBody">
            <input
              type="file"
              id="file1"
              onChange={(e) => {
                uploadFile(e);
              }}
              name="fileUpload"
              className="file-input"
            />
            <label htmlFor="file1">
              <Icon icon="bi:cloud-arrow-up" /> <span> Upload Card</span>
            </label>
          </div>
        </div>

        <div className="card-main">
          <h3>Card Templates</h3>
          <div className="cardBody">
            <ul className="card-list">
              {cardDefinitions.map((data, index) => {
                return (
                  <li className="flow" key={index}>
                    <div className="cta-list">
                      <button
                        className="cta-delete cta-user"
                        onClick={() => {
                          handleShow();
                          setCardId(data.id);
                        }}
                      >
                        <Icon icon="la:user-solid" />
                      </button>
                      <button
                        className="cta-delete"
                        onClick={() => deleteCard(data.id)}
                      >
                        <Icon icon="mi:delete"></Icon>
                      </button>

                      <input
                        type="radio"
                        name="card-selection"
                        id={data.id}
                        checked={data.isActive}
                        className="checkbox-style"
                        onChange={() => changeActiveCard(data)}
                      />

                      <label htmlFor={data.id}>
                        <i>
                          <svg
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 130.2 130.2"
                          >
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
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeMiterlimit="10"
                              points="100.2,40.2 51.5,88.8 29.8,67.5 "
                            ></polyline>
                          </svg>
                        </i>
                      </label>
                    </div>
                    <Link to={`/edit/${data.id}`}>
                      <div className="cardHeader">
                        <div className="bc-main ">
                          <div className="cardHeader text-center">
                            <img src={data.backgroundImageUrl} alt="" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <TestUser show={show} handleClose={handleClose} id={cardId}></TestUser>
      </div>
    </>
  );
};

export default Home;
