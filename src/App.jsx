import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SavePass from './components/SavePass'
import EnterPass from './components/EnterPass'
import FileManager from './components/FileManager'

function App() {

  const [pass, setPass] = useState("")
  const [loggedIn, setLoggedIn] = useState(false)
  const [reset, setReset] = useState("")
  useEffect(() => {
    let pass = localStorage.getItem("password")
    console.log(pass)
    setPass(pass)
  }, [pass])

  function resetStorage() {
    localStorage.clear()
    setPass("")
    setLoggedIn(false)

    const request = indexedDB.open("MyFilesDB", 1);

  request.onsuccess = (event) => {
    const db = event.target.result;

    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");

    store.clear();

    transaction.oncomplete = () => {
      console.log("All files deleted");
    };
  };
  }
  function newPaaPrompt() {
    let oldPass = prompt("Enter Your Old Pass")
    console.log(oldPass);
    if (oldPass != localStorage.getItem("password")) {
      alert("your old password isn't match try again")

      return { status: false }
    }
    if (!oldPass) {
      alert("Something Went Wrong Please Retry Again")
    }

    let newPass = prompt("Enter Your New Pass")
    console.log(newPass);
    if (!newPass) {
      alert("Something Went Wrong Please Retry Again")
    }

    if (newPass.length < 8) {
      alert("Enter atleast 8 alphabet in your pass ")
      newPaaPrompt()

      return { status: false }
    }

    let reNewPass = prompt("Re - Enter Your New Pass")


    if (newPass != reNewPass) {
      alert("Please Enter Same Password ")
      newPaaPrompt()
      return { status: false }

    } else if (newPass == reNewPass) {
      localStorage.setItem("password", newPass)
      alert("Password Change")

      return { status: "ok" }
    }

  }

  function changePassword() {
    let result = newPaaPrompt()
  }


  return (
    <>
      <div className='w-screen h-screen flex flex-col justify-center items-center bg-white'>
        <button className='z-5 absolute top-5 right-5 bg-cyan-400 text-white p-3 rounded-2xl' onClick={resetStorage}>Rest Storage</button>
        <button className='z-5 absolute top-5 right-40 bg-cyan-400 text-white p-3 rounded-2xl' onClick={changePassword}>Change Password</button>
        {!pass && <SavePass setPass={setPass} />}
        {(pass && !loggedIn) && <EnterPass setLoggedIn={setLoggedIn} />}
        {loggedIn == true && <FileManager />}
      </div>
    </>
  )
}

export default App
