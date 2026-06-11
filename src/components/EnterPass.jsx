import React, { useState } from 'react'

const EnterPass = ({setLoggedIn}) => {
let [pass, setPass] = useState("")

function inputHandel() {
    if(!pass){
        alert("Please Enter Password First")
        return
    }

    let localPass = localStorage.getItem("password")
    if(pass != localPass){
        alert("Incorect Password Please Try Again")
        return
    }
    else if (pass == localPass){
        setLoggedIn(true)
    }
}
  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-100/0 p-4">
  <div className="w-full max-w-md bg-white/0 rounded-2xl shadow-lg p-6 sm:p-8">
    <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
      Login
    </h1>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Password
        </label>

        <input
          type="password"
          onChange={(e) => setPass(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={inputHandel}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition"
      >
        Save
      </button>
    </div>
  </div>
</div>
  )
}

export default EnterPass
