import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [allBrands, setAllBrands] = useState(null);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then(setAllBrands)
      .catch(console.error);
  }, []);

  if (allBrands) {
    return <div>{JSON.stringify(allBrands.data)}</div>;
  }

  return <div>No data available.</div>;
}

export default App;
