import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import { ToastContainer, toast } from "react-toastify";

const ViewAllEmployees = () => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [teamLeads, setTeamLeads] = useState({});

  useEffect(() => {
    const getAllEmployee = async () => {
      const allEmployee = await retrieveAllEmployees();
      if (allEmployee) {
        // Assign random groups to employees
        const employeesWithGroups = allEmployee.users.map((employee) => ({
          ...employee,
          group: assignRandomGroup(),
        }));

        // Determine team leads for each group
        const leads = assignTeamLeads(employeesWithGroups);

        setAllEmployees(employeesWithGroups);
        setFilteredEmployees(employeesWithGroups);
        setTeamLeads(leads);
      }
    };

    getAllEmployee();
  }, []);

  const retrieveAllEmployees = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/user/employee/all"
      );
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      toast.error("Unable to fetch employees. Please try again later.");
    }
  };

  const deleteEmployee = (userId) => {
    fetch("http://localhost:8080/api/user/delete?userId=" + userId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((result) => {
        result.json().then((res) => {
          if (res.success) {
            toast.success(res.responseMessage, {
              position: "top-center",
              autoClose: 1000,
            });
            const updatedEmployees = allEmployees.filter((emp) => emp.id !== userId);
            const updatedFilteredEmployees = filteredEmployees.filter(
              (emp) => emp.id !== userId
            );

            setAllEmployees(updatedEmployees);
            setFilteredEmployees(updatedFilteredEmployees);

            // Reassign team leads
            const updatedLeads = assignTeamLeads(updatedEmployees);
            setTeamLeads(updatedLeads);
          } else {
            toast.error("Failed to delete the employee.", {
              position: "top-center",
              autoClose: 1000,
            });
          }
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error("Unable to delete the employee. Please try again.", {
          position: "top-center",
          autoClose: 1000,
        });
      });
  };

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    if (group === "All") {
      setFilteredEmployees(allEmployees);
    } else {
      const groupEmployees = allEmployees.filter(
        (employee) => employee.group === group
      );
      setFilteredEmployees(groupEmployees);
    }
  };

  const assignRandomGroup = () => {
    const groups = ["Group A", "Group B", "Group C", "Group D", "Group E"];
    return groups[Math.floor(Math.random() * groups.length)];
  };

  const assignTeamLeads = (employees) => {
    const groups = ["Group A", "Group B", "Group C", "Group D", "Group E"];
    const leads = {};

    groups.forEach((group) => {
      const groupEmployees = employees.filter(
        (employee) => employee.group === group
      );

      if (groupEmployees.length > 0) {
        const teamLead = groupEmployees.reduce((prev, current) =>
          prev.lastName < current.lastName ? prev : current
        );
        leads[group] = teamLead.firstName + " " + teamLead.lastName;
      }
    });

    return leads;
  };

  return (
    <div className="mt-3">
      <div
        className="card form-card ms-2 me-2 mb-5 custom-bg border-color"
        style={{
          height: "45rem",
        }}
      >
        <div className="card-header custom-bg-text text-center bg-color">
          <h2>All Students</h2>
        </div>
        <div className="card-body" style={{ overflowY: "auto" }}>
          {/* Dropdown for Groups */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="groupSelect" className="me-2">
              Select Group:
            </label>
            <select
              id="groupSelect"
              className="form-select w-auto"
              value={selectedGroup}
              onChange={(e) => handleGroupChange(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Group A">Group A (Team Lead: {teamLeads["Group A"]})</option>
              <option value="Group B">Group B (Team Lead: {teamLeads["Group B"]})</option>
              <option value="Group C">Group C (Team Lead: {teamLeads["Group C"]})</option>
              <option value="Group D">Group D (Team Lead: {teamLeads["Group D"]})</option>
              <option value="Group E">Group E (Team Lead: {teamLeads["Group E"]})</option>
            </select>
          </div>

          {/* Employee Table */}
          <div className="table-responsive">
            <table className="table table-hover text-color text-center">
              <thead className="table-bordered border-color bg-color custom-bg-text">
                <tr>
                  <th scope="col">Student ID</th>
                  <th scope="col">First Name</th>
                  <th scope="col">Last Name</th>
                  <th scope="col">Email ID</th>
                  <th scope="col">Phone No</th>
                  <th scope="col">Address</th>
                  <th scope="col">Group</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>
                      <b>{employee.id}</b>
                    </td>
                    <td>
                      <b>{employee.firstName}</b>
                    </td>
                    <td>
                      <b>{employee.lastName}</b>
                    </td>
                    <td>
                      <b>{employee.emailId}</b>
                    </td>
                    <td>
                      <b>{employee.contact}</b>
                    </td>
                    <td>
                      <b>
                        {employee.street +
                          " " +
                          employee.city +
                          " " +
                          employee.pincode}
                      </b>
                    </td>
                    <td>
                      <b>{employee.group}</b>
                    </td>
                    <td>
                      <button
                        onClick={() => deleteEmployee(employee.id)}
                        className="btn btn-sm bg-color custom-bg-text"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewAllEmployees;