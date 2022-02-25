import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

const App = () => {
  const initialState = {
    firstName: '',
    lastName: '',
    address: '',
    ssn: ''
  }

  const [newMember, setNewMember] = useState(initialState)
  const [disabled, setDisabled] = useState(true)
  const [members, setMembers] = useState([])

  const handleChange = (e) => {
    setNewMember({
      ...newMember,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    getMembers();
  }, [])

  useEffect(() => {
    newMember.firstName.trim() &&
    newMember.lastName.trim() &&
    newMember.address.trim() &&
    validFormat(newMember.ssn)
      ? setDisabled(false)
      : setDisabled(true)
  }, [newMember])

  const validFormat = (ssn) => {
    var regex = /^\d{3}-\d{2}-\d{4}$/
    return ssn.match(regex) != null
  }

  const save = (e) => {
    e.preventDefault()
    saveMember(newMember)
    reset()
  }

  const reset = () => {
    setNewMember(initialState)
  }

  async function getHeaders() {
    const access = await axios.post('http://localhost:8081/auth', { username: 'sarah', password: 'connor' })
    const token = access.data.token;
    const headers = { headers: {Authorization: `Bearer ${token}`} }
    return headers; 
  }

  async function getMembers() {
    const res = await axios.get('http://localhost:8081/api/members', await getHeaders())
    const members = res.data;
    setMembers(members);
  }

  async function saveMember(newMember) {
    try {
      await axios.post('http://localhost:8081/api/members', newMember, await getHeaders());
      setMembers(members => [...members, newMember]);
    } catch(error) {
      alert('No se pudo insertar la información en la tabla, verifique que su número SSN sea único.')
    }
  }

  return (
    <div className='App'>
      <div>
        <h2>Form</h2>

        <form className='Form' onSubmit={save}>
          <input
            type='text'
            placeholder='First Name'
            name='firstName'
            value={newMember.firstName}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Last Name'
            name='lastName'
            value={newMember.lastName}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='Address'
            name='address'
            value={newMember.address}
            onChange={handleChange}
          />
          <input
            type='text'
            placeholder='SSN'
            name='ssn'
            value={newMember.ssn}
            onChange={handleChange}
          />

          <button type='button' onClick={reset}>
            Reset
          </button>
          <button type='submit' disabled={disabled}>
            Save
          </button>
        </form>
      </div>

      <div>
        <h2>Table</h2>

        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>SSN</th>
            </tr>
          </thead>

          <tbody>
            {members.length > 0 &&
              members.map((member, index) => (
                <tr key={index}>
                  <td>{member.firstName}</td>
                  <td>{member.lastName}</td>
                  <td>{member.address}</td>
                  <td>{member.ssn}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
