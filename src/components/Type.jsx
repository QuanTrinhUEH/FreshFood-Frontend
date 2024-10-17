import React, { useEffect, useState } from 'react'
import '../css/Item.scss'

const Type = ({ props, onChange }) => {
    const [select, setSelect] = useState(props.type[0])
    const handleChange = async (e) => {
        setSelect(e.target.value);
    }
    useEffect(() => {
        onChange(props.name, select)
    }, [select])
    return (
        <div className="type">
            <h3>{props.name}</h3>
            <select name={props.name} value={select} onChange={handleChange}>
                {props.type.map((f, j) => (
                    <option value={f} key={j}>{f}</option>
                ))}
            </select>
        </div>
    )
}

export default Type