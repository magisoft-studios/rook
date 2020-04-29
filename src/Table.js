import React from 'react'

const TableHeader = () => {
    return (
        <thead>
        <tr>
            <th>Name</th>
            <th>Job</th>
        </tr>
        </thead>
    )
}

const TableBody = (props) => {
    const rows = props.characterData.map((row, index) => {
        return (
            <tr key={index}>
                <td>{row.userName}</td>
                <td>{row.userJob}</td>
                <td>
                    <button onClick={() => props.removeCharacter(index)}>Delete</button>
                </td>
            </tr>
        )
    })

    return <tbody>{rows}</tbody>
}

const Table = (props) => {
    return (
        <table>
            <TableHeader />
            <TableBody
                characterData={props.characterData}
                removeCharacter={props.removeCharacter}
            />
        </table>
    )
 }

export default Table