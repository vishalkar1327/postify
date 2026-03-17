import { useState } from "react";
import "./admin.css";

export default function Admin(){

 const [credits,setCredits]=useState(9);
 const [plan,setPlan]=useState("Premium");

 return(
 <div className="admin-wrap">

 <aside className="sidebar">
   <h2>POSTIFY</h2>
   <p>Admin Panel</p>

   <button className="active">Dashboard</button>
   <button>Active Users</button>
   <button>Edit Plans</button>
 </aside>

 <main className="admin-main">

 <h1>Admin Dashboard</h1>

 <div className="stats">

   <div className="stat-card">
     <h4>Active Users</h4>
     <p>27</p>
   </div>

   <div className="stat-card">
     <h4>Current Plan</h4>
     <p>{plan}</p>
     <button onClick={()=>setPlan(plan==="Premium"?"Free":"Premium")}>
       Switch Plan
     </button>
   </div>

   <div className="stat-card">
     <h4>User Credits</h4>
     <p>{credits}</p>
     <div className="btns">
       <button onClick={()=>setCredits(c=>c+1)}>+</button>
       <button onClick={()=>setCredits(c=>c-1)}>-</button>
     </div>
   </div>

 </div>

 <h2 style={{marginTop:"40px"}}>Users</h2>

 <table className="user-table">
 <thead>
 <tr>
 <th>Name</th>
 <th>Email</th>
 <th>Plan</th>
 <th>Credits</th>
 </tr>
 </thead>

 <tbody>
 <tr>
 <td>Vishal</td>
 <td>user@postify.ai</td>
 <td>{plan}</td>
 <td>{credits}</td>
 </tr>
 </tbody>
 </table>

 </main>

 </div>
 );
}
