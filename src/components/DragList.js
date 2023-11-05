// SubDocumentsList.js
import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import DraggableItem from './DraggableItem'; // Ваш компонент для drag-елементів

function DragList({ docId, db }) {
  const [subDocuments, setSubDocuments] = useState([]);

  useEffect(() => {
    const fetchSubDocuments = async () => {
      const subDocsQuery = query(collection(db, `disciplines-db/${docId}/lectures`)); // Змініть на вашу колекцію
      const subDocsSnapshot = await getDocs(subDocsQuery);
      const subDocsData = [];

      subDocsSnapshot.forEach((doc) => {
        subDocsData.push({ id: doc.id, ...doc.data() });
      });

      setSubDocuments(subDocsData);
    };

    if (docId) {
      fetchSubDocuments();
    }
  }, [docId, db]);

  return (
    <div>
      {subDocuments.map((subDoc) => (
        <DraggableItem key={subDoc.id} id={subDoc.id} text={subDoc.Name} />
      ))}
    </div>
  );
}

export default DragList;
