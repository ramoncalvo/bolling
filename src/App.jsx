import { useEffect } from "react";
import { Abb } from "./data/Abb";
import { Osl } from "./data/Osl";
import { getDataSet } from "./fn/utils";

function App() {

  useEffect(() => {
    getDataSet('STL', Osl)
    getDataSet('ABB', Abb)

    return () => {

    }
  }, [])


  return (
    <div className="App">
      <h1>Bollinger app</h1>
      <canvas id="STL" width="700" height="250"></canvas>
      <canvas id="ABB" width="700" height="250"></canvas>
    </div>
  )
}

export default App
