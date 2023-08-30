
import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import "./Schedule.css";
import Zoom from "./Zoom";

import CreateForm from '../CreateForm';
import {  updateDoc, doc, getDoc, collection, getDocs,  } from 'firebase/firestore';
import { db } from '../../firebase'; 

import Button from "@mui/material/Button";



const Schedule = () => {
  const [eventsDay, setEventsDay] = useState([]);
  const today = new Date();
  const firstDayOfWeek = new Date(today);
  firstDayOfWeek.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );

  

  const originalStartDate = new DayPilot.Date(firstDayOfWeek);



  const updateEventInFirestore = async (eventId, newStart, newEnd, newResource) => {
    try {
      const eventRef = doc(db, 'disciplines-db', eventId);
      
      // Перевірте, чи існує документ перед оновленням
      const docSnapshot = await getDoc(eventRef);
      if (docSnapshot.exists()) {
        // Оновіть документ, оскільки він існує
        await updateDoc(eventRef, {
          start: newStart,
          end: newEnd,
          resource: newResource,
        });
        console.log(`Event ${eventId} updated in Firestore.`);
      } else {
        console.error(`Document ${eventId} does not exist.`);
      }
    } catch (error) {
      console.error('Error updating event in Firestore:', error);
    }
  };
  
  
  
  

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
    resources: [
      { name: "Resource A", id: "A" },
      { name: "Resource B", id: "B" },
      { name: "Resource C", id: "C" },
      { name: "Resource D", id: "D" },
      { name: "Resource E", id: "E" },
      { name: "Resource F", id: "F" },
    ],

    

    onEventMoved: async (args) => {
      try {
        const eventData = args.e.data;
        if (!eventData) {
          console.error("Event data is undefined.");
          return;
        }
    
        const eventId = eventData.id;
        const newStart = args.newStart.toString();
        const newEnd = args.newEnd.toString();
        const newResource = args.newResource;
        // Оновіть значення в Firestore
        await updateEventInFirestore(eventId, newStart, newEnd, newResource);
    
        console.log("Event moved:", eventId, newStart, newEnd);
        getScheduler().message("Event moved: " + eventData.text);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    
    
    // onTimeRangeSelected: (args) => {
    //   DayPilot.Modal.prompt("New event name", "Event").then((modal) => {
    //     getScheduler().clearSelection();
    //     if (!modal.result) {
    //       return;
    //     }
    //     getScheduler().events.add({
    //       id: DayPilot.guid(),
    //       text: modal.result,
    //       start: args.start,
    //       end: args.end,
    //       resource: args.resource,
    //     });
    //   });
    // },
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







  const loadData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "disciplines-db"));

      const loadedEvents = [...querySnapshot.docs].map((doc, index) => {
        const data = doc.data()
        console.log(data.start, "2023-08-29T00:00:00")

        return{
          id: doc.id,
              text: data.Name,
          start: data.end,
          end: data.end,
            resource: data.resource,
        }
      }).filter((item) => item.start)

      setEventsDay(loadedEvents)

  } catch (error) {
    console.error("Error loading events from Firebase:", error);
  }
  };


  useEffect(() => {
    loadData();
  },[]);

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
        
        
               
      </div>
      <div style={{ display: "flex", marginBottom: "30px" }}>
        <div className={"draggable-container"}>
          <CreateForm />
          
          
          {/* <DraggableItem id={101} text={"Item #101"} days={1}></DraggableItem>
          <DraggableItem id={102} text={"Item #102"} days={1}></DraggableItem>
          <DraggableItem id={103} text={"Item #103"} days={1}></DraggableItem> */}
          
        </div>

        <div style={{ flex: 1 }}>
          <DayPilotScheduler
            {...config} events={eventsDay}
            ref={schedulerRef}
            
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;