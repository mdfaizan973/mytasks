import axios from "axios";
import { useState, useEffect } from "react";
import { AiFillDelete, AiOutlineBug } from "react-icons/ai";
import { BsFillStopwatchFill } from "react-icons/bs";
import { PiInfoFill } from "react-icons/pi";
import { RiBookmarkFill } from "react-icons/ri";
import { message, Spin } from "antd";
import "./styles.css";
export default function TaskTodo() {
  const [taskInput, setTaskInput] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [infodata, setInfoData] = useState({});
  const [filterValue, setFilterValue] = useState("");
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("https://orgaincspro.onrender.com/upcomingroducts")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };
  // ----
  const addTodo = () => {
    if (!taskInput.trim()) {
      alert("Please enter a task before adding!");
      return;
    }
    const newTaskStatus = "New";
    const newTask = {
      date: new Date(),
      task: taskInput,
      status: newTaskStatus,
    };
    console.log(newTask, 11);
    axios
      .post(`https://orgaincspro.onrender.com/upcomingroducts`, newTask)
      .then((res) => {
        console.log("New task added:", res.data);
        fetchData();
        message.success("New Task Added Successfully !");
        setTaskInput("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const updateStatus = (taskId, newStatus) => {
    axios
      .patch(`https://orgaincspro.onrender.com/upcomingroducts/${taskId}`, {
        status: newStatus,
      })
      .then((res) => {
        console.log(res);
        const updatedData = data.map((task) => {
          if (task.id === taskId) {
            return { ...task, status: newStatus };
          }
          return task;
        });
        message.success(`Task Status Updated To ${newStatus}!`);

        setData(updatedData);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // info--------------------------------
  const handleInfo = (id) => {
    axios
      .get(`https://orgaincspro.onrender.com/upcomingroducts/${id}`)
      .then((res) => {
        console.log(res.data);
        setInfoData(res.data);
        setIsOpen(true);
        message.info(`Task ${id} Information!`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // delete

  const handleDelete = (id) => {
    axios
      .delete(`https://orgaincspro.onrender.com/upcomingroducts/${id}`)
      .then((res) => {
        console.log(res.data);
        const deletedData = data.filter((ele) => ele.id !== id);
        setData(deletedData);
        message.error(`Task Removed - ${id}!`);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // filter
  const filterData = () => {
    if (filterValue === "") {
      return data; // Return all data if filter value is empty--
    } else {
      return data.filter((task) => task.status === filterValue); // Filter data based on selected value
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const closePopup = () => {
    setIsOpen(false);
  };
  return (
    <div>
      <div className="input_container">
        <div className="input_btn">
          <div className="select">
            <select
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            >
              <option value="">All Task</option>
              <option value="New">New Task</option>
              <option value="Pending">Pending Task</option>
              <option value="Done">Done Task</option>
            </select>
          </div>

          <input
            placeholder="Enter Your Tasks..."
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          />
          <button
            // className="btn-12"
            className="custom-btn btn-12"
            onClick={() => addTodo()}
          >
            <span>Click To Add!</span>
            <span>Add Tasks</span>
          </button>
        </div>
      </div>

      <div className="main_container">
        <table>
          {loading ? (
            <div style={{ padding: "10px", textAlign: "center" }}>
              <Spin size="large" />
            </div>
          ) : (
            <tbody>
              {filterData().map((ele) => (
                <tr key={ele.id} className="task_row">
                  <td className="delete">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(ele.id)}
                    >
                      <AiFillDelete />
                    </button>
                  </td>

                  <td className="tasks">{ele.task} </td>
                  <td>
                    <button className={ele.status}>{ele.status}</button>
                  </td>
                  <td className="actions">
                    <button
                      className="newbtn"
                      onClick={() => updateStatus(ele.id, "New")}
                    >
                      <AiOutlineBug />
                    </button>

                    <button
                      className="pendingbtn"
                      onClick={() => updateStatus(ele.id, "Pending")}
                    >
                      <BsFillStopwatchFill />
                    </button>

                    <button
                      className="donebtn"
                      onClick={() => updateStatus(ele.id, "Done")}
                    >
                      <RiBookmarkFill />
                    </button>
                    <button
                      className="infobtn"
                      onClick={() => handleInfo(ele.id)}
                    >
                      <PiInfoFill />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {isOpen && (
        <div className="task-card">
          <button className="close-button" onClick={closePopup}>
            X
          </button>

          <div className="task-info">
            <div className="task-detail">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {infodata.date.substring(0, 10)}
              </span>
            </div>
            <div className="task-detail">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{infodata.id}</span>
            </div>
            <div className="task-detail">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{infodata.status}</span>
            </div>
          </div>
          <div className="task-description">
            <span className="description-label">Task:</span>
            <p className="description-text">{infodata.task}</p>
          </div>
        </div>
      )}
    </div>
  );
}
