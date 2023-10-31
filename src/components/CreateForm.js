import * as React from "react";
import { useState } from "react";
import "../components/scheduleComp/Schedule.css";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import DeleteIcon from '@mui/icons-material/Delete';


import DraggableItem from "./scheduleComp/DraggableItem";
import { db } from "../firebase";
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect } from "react";

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
  const [newItem, setNewItem] = useState({ text: "", lectures: "", labs: "", examOrCredit: "", x: 0, y: 0 });
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [open, setOpen] = React.useState(false);

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
    setNewItem({ text: "", x: 0, y: 0 });
    handleClose();
  };

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      await handleCreateItem();
      const docRef = await addDoc(collection(db, "disciplines-db"), {
        Name: newItem.text,
        lectures: newItem.lectures,
        labs: newItem.labs,
        finalCheck: newItem.examOrCredit,
        start: "",
        end: "",
        resource: "",
      });
      console.log("Document written with ID: ", docRef.id);

      fetchItems();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


  const handleDeleteItem = async (itemId) => {
    try {
      // Видаліть предмет з бази даних на основі itemId
      await deleteDoc(doc(db, "disciplines-db", itemId));
      
      // Оновіть стан списку предметів, щоб видалити вибраний предмет
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
          <MenuItem key={item.id} value={item.Name} style={{display:"flex"}}>
            {item.Name}

            <DeleteIcon onClick={() => handleDeleteItem(item.id)}  style={{ fontSize: "16px" }}/>
            
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
          {/* <form className="create-form" onSubmit={addTodo}>
            <TextField
              required
              type="text"
              id="discipline"
              label="Введіть назву"
              value={newItem.text}
              onChange={handleNewItemTextChange}
            /> */}
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
                onChange={(event) => setNewItem({ ...newItem, lectures: event.target.value })}
              />
              <TextField
                required
                type="number"
                id="labs"
                label="Кількість лабораторних"
                value={newItem.labs}
                onChange={(event) => setNewItem({ ...newItem, labs: event.target.value })}
              />
              <Select
                required
                labelId="exam-or-credit-label"
                id="exam-or-credit"
                label="Тип оцінювання"
                value={newItem.examOrCredit}
                onChange={(event) => setNewItem({ ...newItem, examOrCredit: event.target.value })}
              >
                <MenuItem value="exam">Іспит</MenuItem>
                <MenuItem value="credit">Залік</MenuItem>
              </Select>
              

            
            <div className="create-form-btn">
              <Button variant="outlined" color="error" onClick={handleClose}>
                Скасувати
              </Button>
              <Button
                className="BoxBtn"
                variant="contained"
                type="submit"
                size="small"
              >
                Зберегти
              </Button>
            </div>
          </form>
        </Box>
      </Modal>
      {selectedItem && <DraggableItem id={selectedItem.id} key={selectedItem.id} text={selectedItem.Name} />}
    </div>
  );
}
