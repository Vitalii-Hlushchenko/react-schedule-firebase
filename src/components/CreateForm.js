import React, { useState, useEffect } from "react";
import "../components/scheduleComp/Schedule.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { TextField, Select, MenuItem } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import DraggableItem from "./scheduleComp/DraggableItem";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function NestedModal() {
  const [newItem, setNewItem] = useState({
    text: "",
    lectures: "",
    labs: "",
    examOrCredit: "",
    x: 0,
    y: 0,
    type: "", // Додав це поле
  });
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = useState(false);
  const [subItems, setSubItems] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNewItemTextChange = (event) => {
    setNewItem({ ...newItem, text: event.target.value });
  };

  const handleCreateItem = async () => {
    setItems((prevItems) => [...prevItems, newItem]);
    setNewItem({ text: "", x: 0, y: 0, type: "" });
    handleClose();
  };

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const newItemWithItemType = { ...newItem, type: newItem.type };
      const docRef = await addDoc(collection(db, "disciplines-db"), {
        Name: newItemWithItemType.text,
        lectures: newItemWithItemType.lectures,
        labs: newItemWithItemType.labs,
        finalCheck: newItemWithItemType.examOrCredit,
        start: "",
        end: "",
        resource: "",
      });

      const docId = docRef.id;

      const lecturesCollection = collection(db, `disciplines-db/${docId}/lectures`);
      const labsCollection = collection(db, `disciplines-db/${docId}/labs`);

      const lectureData = {
        start: "",
        end: "",
        resources: "",
      };

      const labData = {
        start: "",
        end: "",
        resources: "",
      };

      for (let i = 0; i < newItemWithItemType.lectures; i++) {
        await addDoc(lecturesCollection, lectureData);
      }

      for (let i = 0; i < newItemWithItemType.labs; i++) {
        await addDoc(labsCollection, labData);
      }

      console.log("Document written with ID: ", docId);

      fetchItems();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, "disciplines-db", itemId));
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Помилка видалення предмету: ", error);
    }
  };

  const fetchItems = async () => {
    const itemsCollection = collection(db, "disciplines-db");
    const itemsSnapshot = await getDocs(itemsCollection);

    const itemsData = [];
    itemsSnapshot.forEach((doc) => {
      itemsData.push({ id: doc.id, ...doc.data() });
    });

    setItems(itemsData);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSelectItem = (event) => {
    const selectedItemName = event.target.value;
    const selectedItemId = items.find((item) => item.Name === selectedItemName)?.id;
    setSelectedItem({ id: selectedItemId, Name: selectedItemName });

    // Отримання підлеглих предметів та їх розташування
    fetchSubItems(selectedItemId);
  };

  const fetchSubItems = async (selectedItemId) => {
    const mainDocRef = doc(db, "disciplines-db", selectedItemId);
    const mainDocSnapshot = await getDoc(mainDocRef);

    if (mainDocSnapshot.exists()) {
      const mainDocData = mainDocSnapshot.data();
      const mainDocName = mainDocData.Name; // Отримайте назву з головного документа

      const labsCollection = collection(db, `disciplines-db/${selectedItemId}/labs`);
      const labsSnapshot = await getDocs(labsCollection);
      const labsData = [];
      labsSnapshot.forEach((doc) => {
        const labItem = { id: doc.id, ...doc.data() };
        // Створіть DraggableItem для кожного елемента з колекції labs та встановіть його розташування
        labsData.push(
          <DraggableItem
            key={labItem.id}
            x={labItem.x}
            y={labItem.y}
            text={`${mainDocName} лабораторна`}
          />
        );
      });

      const lecturesCollection = collection(
        db,
        `disciplines-db/${selectedItemId}/lectures`
      );
      const lecturesSnapshot = await getDocs(lecturesCollection);
      const lecturesData = [];
      lecturesSnapshot.forEach((doc) => {
        const lectureItem = { id: doc.id, ...doc.data() };
        // Створіть DraggableItem для кожного елемента з колекції lectures та встановіть його розташування
        lecturesData.push(
          <DraggableItem
            key={lectureItem.id}
            x={lectureItem.x}
            y={lectureItem.y}
            text={`${mainDocName} лекція`}
          />
        );
      });

      setSubItems([...labsData, ...lecturesData]);
    }
  };

  return (
    <div className="add-select-container">
      <Button onClick={handleOpen}>Додати предмет</Button>
      <Select
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        label="jgfgf"
        placeholder="kjhkj"
        value={selectedItem ? selectedItem.Name : ""}
        onChange={handleSelectItem}
      >
        {items.map((item) => (
          <MenuItem key={item.id} value={item.Name} style={{ display: "flex" }}>
            {item.Name}
            <DeleteIcon onClick={() => handleDeleteItem(item.id)} style={{ fontSize: "16px" }} />
          </MenuItem>
        ))}
      </Select>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <form className="create-form" onSubmit={addTodo}>
            <TextField
              required
              type="text"
              id="discipline"
              label="Назва предмету"
              value={newItem.text}
              onChange={handleNewItemTextChange}
            />
            <TextField
              required
              type="number"
              id="lectures"
              label="Кількість лекцій"
              value={newItem.lectures}
              onChange={(event) =>
                setNewItem({ ...newItem, lectures: event.target.value })
              }
            />
            <TextField
              required
              type="number"
              id="labs"
              label="Кількість лабораторних"
              value={newItem.labs}
              onChange={(event) =>
                setNewItem({ ...newItem, labs: event.target.value })
              }
            />
            <Select
              required
              labelId="exam-or-credit-label"
              id="exam-or-credit"
              label="Тип оцінювання"
              value={newItem.type} // Оновлено
              onChange={(event) => setNewItem({ ...newItem, type: event.target.value })
              }
            >
              <MenuItem value="exam">Іспит</MenuItem>
              <MenuItem value="credit">Залік</MenuItem>
            </Select>
            <div className="create-form-btn">
              <Button variant="outlined" color="error" onClick={handleClose}>
                Скасувати
              </Button>
              <Button className="BoxBtn" variant="contained" type="submit" size="small">
                Зберегти
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {selectedItem && (
        <DraggableItem
          id={selectedItem.id}
          key={selectedItem.id}
          text={`${selectedItem.Name} ${newItem.type}`}
        />
      )}
      {subItems.map((subItem, index) => (
        <div key={index}>{subItem}</div>
      ))}
    </div>
  );
}
