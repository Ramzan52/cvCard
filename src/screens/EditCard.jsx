import React, { useEffect, useState, useRef } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import { Rnd } from "react-rnd";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Topbar from "../components/Topbar";
import { employeeFields } from "../constants/employeeFields";
import { fonts } from "../constants/fonts";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
import SimpleBar from "simplebar-react";
import { useNavigate } from "react-router";

const EditCard = () => {
  let navigate = useNavigate();

  const ref = useRef(null);

  var cardHeight = document.querySelector("#card");

  const { id } = useParams();

  const [color, setColor] = useColor("hex", "#212529");
  const [cardFont, setCardFont] = useColor("");

  const [activeField, setActiveField] = useState(null);
  const [cardDetails, setCardDetails] = useState([]);
  const [cardFields, setCardFields] = useState([]);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const fetchCardDetails = async () => {
    const response = await api.get(`card-definitions/${id}`);
    if (response && response.ok) {
      const cardDefinitionFields = response.data.fields;

      setCardDetails(response.data);
      setCardFields((prev) => {
        const updatedCardFields = prev.map((x) => ({ ...x }));
        cardDefinitionFields.forEach((cardDefField) => {
          const cardField = updatedCardFields.find(
            (x) => x.name === cardDefField.name
          );

          if (cardField) {
            cardField.checked = true;
            cardField.position = cardDefField.position;
            cardField.formatting = cardDefField.formatting;
          }
        });
        return updatedCardFields;
      });
    }
  };

  const fetchOrganizationDetails = async () => {
    const response = await api.get(`Organizations/my-organization`);
    if (response && response.ok) {
      setCardFont(response.data.fontFamily);
      const orgFields = response.data.fields.map((field) => ({
        name: field.name,
        title: field.name,
        type: "Text",
        checked: false,
        formatting: {
          font: "",
          fontSize: 16,
          color: "#777",
        },
        position: {
          top: 0,
          left: 0,
        },
      }));
      setCardFields((prev) => [...prev, ...orgFields]);
    }
  };

  const selectCardField = (fieldName, checked) => {
    const updatedCardFields = cardFields.map((x) => ({ ...x }));
    const cardField = updatedCardFields.find((x) => x.name === fieldName);
    cardField.checked = checked;
    setCardFields(updatedCardFields);
  };

  useEffect(() => {
    setCardFields(
      employeeFields.map((field) => ({
        ...field,
        checked: false,
        formatting: {
          font: "",
          fontSize: 16,
          color: "#777",
        },
        position: {
          top: 0,
          left: 0,
        },
      }))
    );

    fetchOrganizationDetails().then(() => fetchCardDetails());
  }, []);

  const editCard = async () => {
    const response = await api.put("card-definitions", {
      id: cardDetails.id,
      templateName: "",
      isActive: false,
      backgroundImageUrl: cardDetails.backgroundImageUrl,
      fields: cardFields.filter((x) => x.checked),
      height: cardHeight.clientHeight,
      width: cardHeight.clientWidth,
    });

    if (response.ok && response.data) {
      notificationSvc.success("Card is updated successfully");
      navigate("/", { replace: true });
    } else notificationSvc.warning(response.data);
  };

  function changeColor(ev) {
    setColor(ev);
    setActiveField((prev) => {
      const newActiveField = JSON.parse(JSON.stringify(prev));
      newActiveField.formatting.color = ev.hex;

      setCardFields((prev) => {
        const newCardFields = prev.map((x) => ({ ...x }));
        const updatedCardFieldIdx = newCardFields.findIndex(
          (x) => x.name === activeField.name
        );
        newCardFields[updatedCardFieldIdx] = newActiveField;
        return newCardFields;
      });
      return newActiveField;
    });
  }

  const setActiveFieldPosition = (position, value) => {
    setActiveField((prev) => {
      const newActiveField = JSON.parse(JSON.stringify(prev));
      newActiveField.position[position] = parseInt(value) || 0;
      setCardFields((prev) => {
        const newCardFields = prev.map((x) => ({ ...x }));
        const updatedCardFieldIdx = newCardFields.findIndex(
          (x) => x.name === activeField.name
        );
        newCardFields[updatedCardFieldIdx] = newActiveField;
        return newCardFields;
      });
      return newActiveField;
    });
  };

  function fontChange(e) {
    setActiveField((prev) => {
      const newActiveField = { ...prev };
      newActiveField.formatting.fontSize = parseInt(e.value);
      return newActiveField;
    });

    setCardFields((prev) => {
      const newCardFields = prev.map((x) => ({ ...x }));
      const updatedCardFieldIdx = newCardFields.findIndex(
        (x) => x.name === activeField.name
      );
      newCardFields[updatedCardFieldIdx] = activeField;
      return newCardFields;
    });
  }

  return (
    <>
      <div className="main">
        <Topbar showSearch={false} />
        <div className="card-main pt-0">
          <div className="cardHeader">
            <h3>Edit Card </h3>
          </div>
          <div className="editField mb-3">
            <div className="row">
              {cardFields.map((field, index) => {
                return (
                  <ul className=" col-lg-6" key={index}>
                    <li>
                      <div className="fieldLabel">
                        <input
                          type="checkbox"
                          id={field.name}
                          name="fieldName"
                          className="checkbox-style"
                          checked={field.checked}
                          onChange={(e) =>
                            selectCardField(field.name, e.target.checked)
                          }
                        />
                        <label htmlFor={field.name}>
                          <i>
                            <svg
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 130.2 130.2"
                            >
                              <circle
                                className="path circle"
                                fill="none"
                                stroke-width="6"
                                stroke-miterlimit="10"
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
                        <div id={index} className="name">
                          {field.title}
                        </div>
                      </div>
                    </li>
                  </ul>
                );
              })}
            </div>
          </div>
          <ul className="card-list mt-5 editcard">
            <li>
              <div
                className="bc-main bcard-1"
                style={{
                  position: "relative",
                }}
                id="myForm"
              >
                <img src={cardDetails.backgroundImageUrl} id="card" alt="" />
                {cardFields
                  .filter((x) => x.checked)
                  .map((field) => (
                    <Rnd
                      enableResizing={false}
                      key={field.name}
                      default={{
                        x: field.position.left,
                        y: field.position.top,
                      }}
                      position={{
                        x: field.position.left,
                        y: field.position.top,
                      }}
                      bounds="parent"
                      onMouseDown={() => {
                        setActiveField(field);
                      }}
                      onDragStop={(e, data) => {
                        setActiveFieldPosition("left", data.x);
                        setActiveFieldPosition("top", data.y);
                        setHeight(ref.current.clientHeight);
                        setWidth(ref.current.clientWidth);
                      }}
                    >
                      {field.type !== "Image" && (
                        <div
                          key={field.name}
                          ref={ref}
                          style={{
                            color: field.formatting.color,
                            fontSize: field.formatting.fontSize,
                            fontFamily: cardFont,
                          }}
                        >
                          {field.title}
                        </div>
                      )}
                      {field.type === "Image" && (
                        <div key={field.name} ref={ref}>
                          <div
                            className={
                              field.name === "profileUrl"
                                ? "brandLogo"
                                : "orgLogo"
                            }
                            style={{
                              width: "80px",
                              height: "80px",
                              background: "#F76588",
                              borderRadius: "50%",
                            }}
                          ></div>
                        </div>
                      )}
                    </Rnd>
                  ))}
              </div>
            </li>
          </ul>
        </div>
      </div>
      {activeField && (
        <div
          className="modal fade  drawerModal"
          id="editField"
          aria-hidden="true"
          style={{ opacity: "1", transform: "translate(0)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <SimpleBar className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Card</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setActiveField(null)}
                />
              </div>
              <div className="bodyModal">
                <div className="modal-body colorPicker">
                  {activeField.type !== "Image" && (
                    <div className="mb-3">
                      <label>Select Color</label>
                      <ColorPicker
                        width={456}
                        height={100}
                        color={color}
                        onChange={changeColor}
                        hideHSV
                        dark
                      />
                    </div>
                  )}
                  {activeField.type !== "Image" && (
                    <div className="mb-4">
                      <label>Font Size</label>

                      <div className="form-field">
                        <Select
                          options={fonts}
                          value={{
                            value: activeField.formatting.fontSize,
                            label: activeField.formatting.fontSize,
                          }}
                          onChange={(e) => fontChange(e)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <label>Position</label>
                    <div className="row">
                      <div className="col">
                        <span className="label">Left</span>
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          value={activeField.position.left}
                          max={cardHeight.clientWidth - width}
                          onChange={(e) =>
                            setActiveFieldPosition("left", e.target.value)
                          }
                        />
                      </div>
                      <div className="col">
                        <span className="label">Top</span>
                        <input
                          className="form-control"
                          type="number"
                          min={0}
                          max={cardHeight.clientHeight - height}
                          value={activeField.position.top}
                          onChange={(e) =>
                            setActiveFieldPosition("top", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modalFooter">
                <button className="btn btn-dark w-100" onClick={editCard}>
                  Save Changes
                </button>
              </div>
            </SimpleBar>
          </div>
        </div>
      )}
    </>
  );
};

export default EditCard;
