import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ViewProjectStatus = () => {
  const [projectStatuses, setProjectStatuses] = useState([]);

  const location = useLocation();
  const project = location.state;

  useEffect(() => {
    const getAllProject = async () => {
      const statuses = await retrieveAllProject();
      if (statuses) {
        setProjectStatuses(statuses.statuses);
      }
    };

    getAllProject();
  }, []);

  const retrieveAllProject = async () => {
    const response = await axios.get(
      "http://localhost:8080/api/project/status/view?projectId=" + project.id
    );
    console.log(response.data);
    return response.data;
  };

  const formatDateFromEpoch = (epochTime) => {
    const date = new Date(Number(epochTime));
    const formattedDate = date.toLocaleString(); // Adjust the format as needed

    return formattedDate;
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg border-color "
        style={{
          height: "45rem",
        }}
      >
        <div className="card-header custom-bg-text text-center bg-color">
          <h2>Project Status</h2>
        </div>
        <div
          className="card-body"
          style={{
            overflowY: "auto",
          }}
        >
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Date Time</th>
                  <th scope="col">Project Status</th>
                </tr>
              </thead>
              <tbody>
                {projectStatuses.map((status) => {
                  return (
                    <tr>
                      <td>
                        <b>{formatDateFromEpoch(status.addedTime)}</b>
                      </td>

                      <td>
                        <b>{status.status}</b>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProjectStatus;
