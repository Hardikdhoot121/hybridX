import React from 'react'
import Navbar from '../../pages/navbar'
import students from "../classData/12th";
import StudentBasicDetails from '../components/StudentBasicDetails';

const AdminAllDetails = () => {
  return (
    <>
        <Navbar/>
        <br></br>
        <StudentBasicDetails/>
    </>
  )
}

export default AdminAllDetails