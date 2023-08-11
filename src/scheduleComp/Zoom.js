import React, { useState } from 'react';

const Zoom = ({ onChange }) => {
    const [level, setLevel] = useState("week");

    const handleChange = (ev) => {
        const newLevel = ev.target.value;
        setLevel(newLevel);
        if (onChange) {
            onChange({level: newLevel});
        }
    };

    return (
        <span className="toolbar-item">
            Zoom:
            <label><input type="radio" name="zoom" value="week-5" onChange={handleChange} checked={level === "week-5"} /> Week-5</label>
            <label><input type="radio" name="zoom" value="week-7"  onChange={handleChange} checked={level === "week-7"} /> Week-7</label>
        </span>
    );
}

export default Zoom;