import React, { useEffect, useState } from 'react'

const SavePass = ({setPass}) => {
let [pass1, setPass1] = useState("")

  useEffect(()=>{
    console.log(localStorage.getItem("password"));
    
  },[])
  function inputHandel(){
    if(!pass1){
      alert("Please Enater Pass Word Hare")
      return
    }
    else if(pass1.length < 8){
      alert("Please Enater Atleast 8 Lenght Password")
      return

    }

    let localPass = localStorage.setItem("password",pass1)
    console.log(localStorage.getItem("password"));
    setPass(localStorage.getItem("password"))
    
    alert("Password Save Successfully")
  }

  return (
    <div className="h-2/10 w-4/10 flex items-center justify-center bg-gray-100">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
    <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
      Save Password
    </h1>

    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Password
        </label>

        <input
          type="text"
          onChange={(e) => setPass1(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <button
        onClick={inputHandel}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-200"
      >
        Save
      </button>
    </div>
  </div>
</div>
  )
}

export default SavePass
