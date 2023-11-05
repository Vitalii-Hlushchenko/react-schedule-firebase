
import React, { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotScheduler } from "daypilot-pro-react";
import "./Schedule.css";
import Zoom from "./Zoom";

import CreateForm from '../CreateForm';
import {  updateDoc, doc, getDoc, collection, getDocs, } from 'firebase/firestore';
import { db } from '../../firebase'; 

import Button from "@mui/material/Button";
import DeleteIcon from '@mui/icons-material/Delete';
import { renderToString } from 'react-dom/server';





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
  
  
  const handleDeleteEvent = async (eventId) => {
    try {
      const eventRef = doc(db, 'disciplines-db', eventId);
      await updateDoc(eventRef, {
        resource: "",
        end: "",
        start: ""
      });
      console.log(`Event ${eventId} deleted in Firestore.`);
    
      // Оновіть стан, щоб подія була видалена з графіка
      setEventsDay((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      console.error("Error deleting event in Firestore:", error);
    }
  };
  
  
  
  
  const deleteIconHtml = renderToString(<DeleteIcon style={{ fontSize: "16px" }}/>);



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
      { name: "Перша пара", id: "A" },
      { name: "Друга пара", id: "B" },
      { name: "Третя пара", id: "C" },
      { name: "Четверта пара", id: "D" },
      { name: "П'ята пара", id: "E" },
      { name: "Шоста пара", id: "F" },
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
        
        await updateEventInFirestore(eventId, newStart, newEnd, newResource);
    
        console.log("Event moved:", eventId, newStart, newEnd);
        getScheduler().message("Event moved: " + eventData.text);
      } catch (error) {
        console.error("Error updating event:", error);
      }
    },
    
    onEventDeleted: (args) => {
      // Отримайте ідентифікатор події
      const eventId = args.e.data.id;
  
      // Викличте функцію видалення події
      handleDeleteEvent(eventId);
    },
  
    
    onBeforeEventRender: (args) => {
      if (!args.data.backColor) {
        args.data.backColor = "#93c47d";
      }
      args.data.borderColor = "darker";
      args.data.fontColor = "white";
      
      args.data.areas = [{
        right: 4,
        top: 8,
        height: 18,
        width: 18,
        html: deleteIconHtml,
        onClick: () => handleDeleteEvent(args.data.id), 
      }];
      
      if (args.data.locked) {
        args.data.areas.push({
          right: 4,
          top: 8,
          height: 18,
          width: 18,
          symbol: "icons/daypilot.svg#padlock",
          color: "error",
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
  
      const loadedEvents = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const start = data.start; 
  
        if (start) {
          loadedEvents.push({
            id: doc.id,
            text: data.Name,
            start: start,
            end: data.end,
            resource: data.resource,
          });
        }
      });
  
      setEventsDay(loadedEvents);
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
        <Button onClick={handlePrevWeek}>Попередній тиждень</Button>
        <Button onClick={handleNextWeek}>Наступний тиждень</Button>
        <Button onClick={handleToday}>Поточний</Button>
      </div>
      <div className="form-container">
        
        
               
      </div>
      <div style={{ display: "flex", marginBottom: "30px" }}>
        <div className={"draggable-container"}>
          <CreateForm />
          
          
          
          
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