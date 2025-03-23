import { Outlet } from "react-router-dom"

const Dashboard = () => {
    // add protection   
  return (
    <div>
        <h1>Dashboard</h1>
        <Outlet/>
    </div>
  )
}

export default Dashboard