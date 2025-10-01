import React, { useEffect, useState } from 'react'
import AppRoutes from './AppRoutes'
import axios from 'axios';

const App = () => {
  //   const [auth, setAuth] = useState({ loading: true, user: null });

  // useEffect(() => {
  //   axios.get("http://localhost:3000/api/auth/check", { withCredentials: true })
  //     .then(res => setAuth({ loading: false, user: res.data.user }))
  //     .catch(() => setAuth({ loading: false, user: null }));
  // }, [auth]);
  return (
    <div>
      <AppRoutes/>
    </div>
  )
}

export default App
