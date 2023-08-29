import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import DraggableItem from "./scheduleComp/DraggableItem";
import { db } from "../firebase";
import {  addDoc, collection, getDocs } from "firebase/firestore";
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
  const [newItemText, setNewItemText] = useState("");
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleNewItemTextChange = (event) => {
    setNewItemText(event.target.value);
    setName(event.target.value); 
  };

  const handleCreateItem = async () => {
    const newItem = { id: items.length + 1, text: newItemText, x: 0, y: 0 };
    setItems([...items, newItem]);
    console.log(newItem);
    handleClose();
  };

  const addTodo = async (e) => {
    e.preventDefault();

    try {
      const newItem = {  text: newItemText };
      setItems([...items, newItem]);

      await handleCreateItem();
      const docRef = await addDoc(collection(db, "disciplines-db"), {
        // id: newItem.id,
        Name: name,
        start: "",
        end: "",
        resource: "",
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };



  const fetchItems = async () => {
    const itemsCollection = collection(db, "disciplines-db");
    const itemsSnapshot = await getDocs(itemsCollection);

    const itemsData = [];
    itemsSnapshot.forEach((doc) => {
      itemsData.push({ id: doc.id, ...doc.data() });
    });
    console.log(itemsSnapshot, itemsData)

    setItems(itemsData);
  };

  useEffect(() => {
    fetchItems();
  }, []);

    


  return (
    <div>
      <Button onClick={handleOpen}>Додати предмет</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}  >
          <form className="create-form" onSubmit={(e) => {
            handleCreateItem();
            addTodo(e);
          }}>
            <TextField
              required
              type="text"
              id="discipline"
              label="Введіть назву"
              onChange={handleNewItemTextChange}
            />
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
      {items.map((item) => (
        <DraggableItem id={item.id} key={item.id} text={item.Name}  />
      ))}
    </div>
  );
}




