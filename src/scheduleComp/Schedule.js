import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import "./Schedule.css";
import Zoom from "./Zoom";
import DraggableItem from "./DraggableItem";
import CreateForm from '../components/CreateForm';

import Button from "@mui/material/Button";
import {  TextField } from "@mui/material";


const Schedule = () => {
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );

  // const currentWeekIndex = DayPilot.Date.today().weekNumber();
  // const todayIndexInWeek = today.getDay();

  const originalStartDate = new DayPilot.Date(firstDayOfWeek);

  const [config, setConfig] = useState({
    startDate: new DayPilot.Date(firstDayOfWeek),
    days: 5,
    scale: "Day",
    timeHeaders: [{ groupBy: "Month" }, { groupBy: "Day", format: "d" }],
    cellWidthSpec: "Auto",
    cellWidth: 50,
    durationBarVisible: false,
    treeEnabled: true,
    weekStarts: 1,

    onEventMoved: (args) => {
      console.log(
        "Event moved: ",
        args.e.data.id,
        args.newStart,
        args.newEnd,
        args.newResource
      );
      getScheduler().message("Event moved: " + args.e.data.text);
    },
    onEventResized: (args) => {
      console.log(
        "Event resized: ",
        args.e.data.id,
        args.newStart,
        args.newEnd
      );
      getScheduler().message("Event resized: " + args.e.data.text);
    },
    onTimeRangeSelected: (args) => {
      DayPilot.Modal.prompt("New event name", "Event").then((modal) => {
        getScheduler().clearSelection();
        if (!modal.result) {
          return;
        }
        getScheduler().events.add({
          id: DayPilot.guid(),
          text: modal.result,
          start: args.start,
          end: args.end,
          resource: args.resource,
        });
      });
    },
    onBeforeEventRender: (args) => {
      if (!args.data.backColor) {
        args.data.backColor = "#93c47d";
      }
      args.data.borderColor = "darker";
      args.data.fontColor = "white";

      args.data.areas = [];
      if (args.data.locked) {
        args.data.areas.push({
          right: 4,
          top: 8,
          height: 18,
          width: 18,
          symbol: "icons/daypilot.svg#padlock",
          fontColor: "white",
        });
      } else if (args.data.plus) {
        args.data.areas.push({
          right: 4,
          top: 8,
          height: 18,
          width: 18,
          symbol: "icons/daypilot.svg#plus-4",
          fontColor: "white",
        });
      }
    },
  });

  // *****************FORM*****
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const [items, setItems] = useState([]);

  const openCreateForm = () => {
    setCreateFormVisible(true);
  };

  const closeCreateForm = () => {
    setCreateFormVisible(false);
    setNewItemText("");
  };

  const handleNewItemTextChange = (event) => {
    setNewItemText(event.target.value);
  };

  const handleCreateItem = () => {
    const newItem = { id: items.length + 1, text: newItemText };
    setItems([...items, newItem]);
    closeCreateForm();
  };

  const schedulerRef = useRef();

  const getScheduler = () => schedulerRef.current.control;

  const zoomChange = (args) => {
    switch (args.level) {
      case "week-5":
        setConfig({
          ...config,
          startDate: DayPilot.Date(firstDayOfWeek),
          days: 5,
          scale: "Day",
        });
        break;
      case "week-7":
        setConfig({
          ...config,
          startDate: DayPilot.Date(firstDayOfWeek),
          days: 7,
          scale: "Day",
        });
        break;
      default:
        throw new Error("Invalid zoom level");
    }
  };

  const loadData = (args) => {
    const resources = [
      { name: "Resource A", id: "A" },
      { name: "Resource B", id: "B" },
      { name: "Resource C", id: "C" },
      { name: "Resource D", id: "D" },
      { name: "Resource E", id: "E" },
      { name: "Resource F", id: "F" },
    ];

    const events = [
      {
        id: 107,
        text: "Reservation 101",
        start: "2023-08-08T00:00:00",
        end: "2023-08-08T00:00:00",
        resource: "A",
      },
      {
        id: 108,
        text: "Reservation 102",
        start: "2023-08-09T00:00:00",
        end: "2023-08-09T00:00:00",
        resource: "A",
      },
    ];

    getScheduler().update({
      resources,
      events,
    });
  };

  useEffect(() => {
    loadData();
  });

  const handlePrevWeek = () => {
    const prevWeekStartDate = config.startDate.addDays(-7);
    setConfig({
      ...config,
      startDate: prevWeekStartDate,
    });
  };

  const handleNextWeek = () => {
    const nextWeekStartDate = config.startDate.addDays(7);
    setConfig({
      ...config,
      startDate: nextWeekStartDate,
    });
  };

  const handleToday = () => {
    setConfig({
      ...config,
      startDate: originalStartDate,
    });
  };

  return (
    <div>
      <div className="toolbar">
        <Zoom onChange={(args) => zoomChange(args)} />
        <Button onClick={handlePrevWeek}>Previous Week</Button>
        <Button onClick={handleNextWeek}>Next Week</Button>
        <Button onClick={handleToday}>Today</Button>
      </div>
      <div className="form-container">
        
        {/* {createFormVisible && (
          <div className="create-form">
            <TextField
              required
              id="outlined-required"
              label="Enter data"
              value={newItemText}
              onChange={handleNewItemTextChange}
            />
            <div className="form-btn">
              <Button
                className="Btn"
                variant="contained"
                type="submit"
                size="small"
                onClick={handleCreateItem}
              >
                Create
              </Button>
              <Button
                className="Btn"
                variant="contained"
                type="submit"
                size="small"
                onClick={closeCreateForm}
              >
                Cancel
              </Button>
            </div>
          </div>
        )} */}
      </div>
      <div style={{ display: "flex", marginBottom: "30px" }}>
        <div className={"draggable-container"}>
          <CreateForm/>
          <div className={"draggable-header"}>Drag items to the Scheduler:</div>
          <Button
            onClick={openCreateForm}
            className="Btn"
            variant="contained"
            type="submit"
            size="small"
          >
            Create
          </Button>
          <DraggableItem id={101} text={"Item #101"} days={1}></DraggableItem>
          <DraggableItem id={102} text={"Item #102"} days={1}></DraggableItem>
          <DraggableItem id={103} text={"Item #103"} days={1}></DraggableItem>
          {items.map((newItem) => (
            <DraggableItem key={newItem.id} text={newItem.text} days={1} />
          ))}
        </div>

        <div style={{ flex: 1 }}>
          <DayPilotScheduler
            {...config}
            ref={schedulerRef}
            // onBeforeTimeHeaderRender={(args) => {
            //   if (args.level === "Day") {
            //     if (args.date.equalsDay(DayPilot.Date.today())) {
            //       args.header.style.background = "lightblue";
            //       args.header.style.color = "black";
            //       args.header.style.fontWeight = "bold";
            //     }
            //   } else if (args.level === "Week") {
            //     const weekNumber = args.date.weekNumber();
            //     const dayIndex = args.date.getDay();
            //     if (
            //       weekNumber === currentWeekIndex &&
            //       dayIndex === todayIndexInWeek
            //     ) {
            //       args.header.innerHTML = `<div class="current-day">${args.header.innerHTML}</div>`;
            //     }
            //   }
            // }}
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
