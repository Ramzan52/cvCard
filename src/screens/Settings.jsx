import { Icon } from "@iconify/react";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import Placeholder from "../assets/images/placeholder.png";
import Topbar from "../components/Topbar";
import { fontsFamily } from "../constants/fonts";
import { api } from "../services/api-service";
import notificationSvc from "../services/notification-service";
const Setting = () => {
  const isInitialDataLoaded = useRef(false);
  const [font, setFont] = useState({ label: "", value: "" });
  const [org, setOrg] = useState({});
  const [orgFields, setOrgFields] = useState([{ name: "", value: "" }]);
  const [orgLogo, setOrgLogo] = useState("");

  const handleAddClick = () => {
    setOrgFields([...orgFields, { name: "", value: "" }]);
  };

  const handleInputChange = (e, index) => {
    const name = e.target.value;
    const fields = [...orgFields];
    fields[index] = {
      ...fields[index],
      name,
    };

    setOrgFields(fields);
  };

  const handleValueChange = (e, index) => {
    const value = e.target.value;
    const fields = [...orgFields];
    fields[index] = {
      ...fields[index],
      value,
    };

    setOrgFields(fields);
  };

  const handleRemoveClick = (index) => {
    const fields = [...orgFields];
    fields.splice(index, 1);
    setOrgFields(fields);
  };

  const uploadFile = async (e) => {
    const formData = new FormData();
    if (
      e.target.files[0]?.type === "image/png" ||
      e.target.files[0]?.type === "image/jpeg"
    ) {
      formData.append("attachment", e.target.files[0]);
      const response = await api.post("upload-attachments", formData);

      setOrgLogo(response.data);
    } else {
      return notificationSvc.error("Please upload valid image format");
    }
  };

  const updateOrgSettings = async () => {
    let sendCall = true;
    if (!orgLogo) {
      notificationSvc.error("Please select your organization logo");
      return;
    } else {
      if (orgFields) {
        orgFields.map((field) => {
          if (field.name === "" || field.value === "") {
            notificationSvc.error("Please fill all added fields properly");
            sendCall = false;
          }
        });
      }

      if (sendCall) {
        orgSetting();
      }
    }
  };
  const orgSetting = async () => {
    const response = await api.put("Settings", {
      logoUrl: orgLogo,
      fields: orgFields,
      fontFamily: font.value,
    });

    if (response && response.ok) {
      notificationSvc.success("Settings are updated successfully");

      fetchOrgSettings();
    } else {
      notificationSvc.error(
        "Something went wrong. Please contact system administrator."
      );
    }
  };

  const fetchOrgSettings = async () => {
    const response = await api.get(`Organizations/my-organization`);
    if (response && response.ok) {
      setOrgFields(response.data.fields);
      setOrgLogo(response.data.logoUrl);
      setOrg(response.data);
      setFont({
        label: response.data.fontFamily,
        value: response.data.fontFamily,
      });

      isInitialDataLoaded.current = true;
    }
  };

  useEffect(() => {
    fetchOrgSettings();
  }, []);

  return (
    <>
      <div className="main">
        <Topbar showSearch={false} />
        <div className="card-main">
          <div className="cardHeader">
            <h3>Settings </h3>
          </div>
          <div className="row">
            <div className="col-lg-5">
              <form>
                <div className="mb-4">
                  <label>Upload Logo</label>
                  <div className="drop-card">
                    <img src={Placeholder} alt="" />
                    <p>
                      <span>
                        <input
                          type="file"
                          id="file1"
                          name="attachment"
                          className="file-upload"
                          onChange={(e) => uploadFile(e)}
                        />
                        <label htmlFor="file1">
                          <span>Upload organization logo</span>
                        </label>
                      </span>
                    </p>

                    <p className="note">Supprorts: JPG , PNG</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="img-uploaded">
                    <div className="img-holder">
                      <img src={orgLogo || org.logoUrl} alt="" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-4">
                      <label htmlFor="">Select Font</label>
                      <div className="form-field">
                        <Select
                          menuPlacement="top"
                          options={fontsFamily}
                          value={{ value: font.value, label: font.label }}
                          onChange={(e) => {
                            setFont(e);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="field_add">
                    <span>Card Fields</span>
                    <button
                      className="cta-icon-small"
                      type="button"
                      onClick={handleAddClick}
                      style={{ border: "none", background: "transparent" }}
                    >
                      <i>
                        <Icon icon="eva:plus-fill" />
                      </i>
                    </button>
                  </div>
                </div>
                {orgFields.map((x, i) => {
                  return (
                    <ul className="filedList" key={i}>
                      <li>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-4">
                              {i === 0 && <label htmlFor="">Title</label>}
                              <input
                                required
                                name="title"
                                placeholder={x.name}
                                type="text"
                                className="form-control"
                                value={x.name}
                                onChange={(e) => handleInputChange(e, i)}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-4">
                              {i === 0 && <label htmlFor="">Value</label>}
                              <input
                                required
                                name="title"
                                placeholder={x.value}
                                type="text"
                                className="form-control"
                                value={x.value}
                                onChange={(e) => handleValueChange(e, i)}
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`cta-delete ${i > 0 ? "no-label" : ""}`}
                          >
                            <Icon
                              icon="mi:delete"
                              onClick={() => handleRemoveClick(i)}
                            />
                          </button>
                        </div>
                      </li>
                    </ul>
                  );
                })}

                <button
                  className="btn btn-dark w-100"
                  onClick={updateOrgSettings}
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Setting;
