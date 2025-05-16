import { useState } from "react";
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { apiClient } from "./lib/axios";

function App() {

  const [input, setInput] = useState<string>("");


  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setter(e.target.value);

  const AiResponse = apiClient.post("")


  return (
    <div className='h-screen w-screen flex justify-center items-center bg-gray-300'>
      <div className="flex items-center justify-center w-3/4 h-3/4 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-center border border-black w-7/8 h-1/5">
          <Input
            type="text"
            placeholder="What do you want to share ?"
            className=" border border-black h-10 w-5/7 rounded-l-full" 
            onChange={handleChange(setInput)}
            />
          <Button className="rounded-r-full" size={"lg"} >SUBMIT</Button>
        </div>
      </div>
    </div>
  )
}

export default App
