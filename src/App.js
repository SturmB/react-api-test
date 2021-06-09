import { useEffect, useState } from "react";
import "./App.css";

export function splitArray(array) {
  const newArray = [];
  array.forEach((str) => {
    const regex = /\d{6}/;
    const index = str.search(regex);
    if (index === -1) {
      newArray.push({ name: str });
      return;
    }
    const storeName = str.slice(0, index - 1);
    const date = str.match(regex)[0];
    if (!newArray.find((obj) => obj.name === storeName)) {
      const len = newArray.push({ name: storeName });
      newArray[len - 1][`months`] = [];
    }
    newArray.find((obj) => obj.name === storeName)[`months`].push(date);
  });
  return newArray;
}

export function properName(str) {
  const array = str.split(`_`);
  const capitalizedArray = array.map(
    (word) => word[0].toUpperCase() + word.substr(1)
  );
  return capitalizedArray.join(` `);
}

export function convertMonth(str) {
  const monthNum = parseInt(str.slice(4, 6), 10);
  const date = new Date();
  date.setMonth(monthNum - 1);
  return date.toLocaleString(`default`, { month: `short` });
}

export function convertMonths(arr) {
  return arr.map((date) => convertMonth(date));
}

export function TableHead({ headers }) {
  return (
    <thead>
      <tr>
        <th rowSpan={2}>{headers[0].name}</th>
        {headers.map((store) => {
          if (store.hasOwnProperty(`months`)) {
            return (
              <th key={store.name} colSpan={Object.keys(store.months).length}>
                {store.name}
              </th>
            );
          }
          return null;
        })}
        <th rowSpan={2}>{headers[headers.length - 1].name}</th>
      </tr>
      <tr>
        {headers.map((store) => {
          if (store.hasOwnProperty(`months`)) {
            // noinspection JSUnresolvedVariable
            return store.months.map((month) => {
              return <th key={store.name + `-` + month}>{month}</th>;
            });
          }
          return null;
        })}
      </tr>
    </thead>
  );
}

export function TableBody({ data, order }) {
  return (
    <tbody>
      {data.map((row) => {
        // noinspection JSUnresolvedVariable
        return (
          <tr key={row.brand}>
            <td>{row.brand}</td>
            {order.map((item) => {
              // noinspection JSUnresolvedVariable
              return <td key={row.brand + item}>{row[item]}</td>;
            })}
            <td>{row.total}</td>
          </tr>
        );
      })}
    </tbody>
  );
}

function App() {
  const [allBrands, setAllBrands] = useState(null);

  useEffect(() => {
    fetch("./data.json")
      .then((res) => res.json())
      .then(setAllBrands)
      .catch(console.error);
  }, []);

  if (allBrands) {
    const columnsRaw = Object.entries(allBrands.data[0])
      .map((point) => {
        if (!/percent/.test(point[0])) {
          return point[0];
        }
        return null;
      })
      .filter((point) => point !== null);
    const dataOrder = [];
    columnsRaw.forEach((column) => {
      if (/\d{6}/.test(column)) {
        dataOrder.push(column);
      }
    });
    const structured = splitArray(columnsRaw);
    const capitalized = structured.map((obj) => {
      obj.name = properName(obj.name);
      if (obj.months) {
        obj.months = convertMonths(obj.months);
      }
      return obj;
    });
    return (
      <table>
        <TableHead headers={capitalized} />
        <TableBody data={allBrands.data} order={dataOrder} />
      </table>
    );
  }

  return <div>No data available.</div>;
}

export default App;
