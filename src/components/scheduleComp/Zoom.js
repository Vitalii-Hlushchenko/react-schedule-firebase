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
            Робочий тиждень:
            <label><input type="radio" name="zoom" value="week-5" onChange={handleChange} checked={level === "week-5"} /> 5 днів</label>
            <label><input type="radio" name="zoom" value="week-7"  onChange={handleChange} checked={level === "week-7"} /> 7 днів</label>
        </span>
    );
}

export default Zoom;