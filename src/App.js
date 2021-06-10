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

export function convertCount(str) {
  const num = parseInt(str);
  return num.toLocaleString(`default`);
}

export function TableHead({ headers }) {
  return (
    <div className="row row-cols-11">
      <div className="col rounded-start border-end">{headers[0].name}</div>
      {headers.map((store) => {
        if (store.hasOwnProperty(`months`)) {
          return (
            <div className="col">
              <div className="row">
                <div className="col border-bottom border-end" key={store.name}>
                  {store.name}
                </div>
              </div>
              <div className="row">
                {store.months.map((month) => {
                  return (
                    <div className="col" key={store.name + `-` + month}>
                      {month}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }
        return null;
      })}
      <div className="col rounded-end">{headers[headers.length - 1].name}</div>
    </div>
    // return store.months.map((month, index, array) => {
    //   let borderClass = ``;
    //   if (index === array.length - 1) {
    //     borderClass = `border-end`;
    //   }
    //   return (
    //     <th key={store.name + `-` + month} className={borderClass}>
    //       {month}
    //     </th>
    //   );
    // });
  );
}

export function TableBody({ data, order, numType }) {
  return data.map((row) => {
    // noinspection JSUnresolvedVariable
    return (
      <div className="row" key={row.brand}>
        <div className="col rounded-start">{row.brand}</div>
        {order.map((item) => {
          if (numType === `count`) {
            // noinspection JSUnresolvedVariable
            return (
              <div className="col" key={row.brand + item}>
                {convertCount(row[item])}
              </div>
            );
          }
          // noinspection JSUnresolvedVariable
          return (
            <div className="col" key={row.brand + item}>
              {row[`${item}_percent`]}%
            </div>
          );
        })}
        <div className="col rounded-end">
          {numType === `count`
            ? convertCount(row.total)
            : `${row.total_percent}%`}
        </div>
      </div>
    );
  });
}

function App() {
  const [allBrands, setAllBrands] = useState(null);
  const [numType, setNumType] = useState(`count`);

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
      <div className="container">
        <div className="row">
          <div className="col">
            <div
              className="btn-group"
              role="group"
              aria-label="Switch between number types"
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setNumType(`count`);
                }}
              >
                Count
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => {
                  setNumType(`percent`);
                }}
              >
                Percent
              </button>
            </div>

            <div className="container">
              <TableHead headers={capitalized} />
              <TableBody
                data={allBrands.data}
                order={dataOrder}
                numType={numType}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>No data available.</div>;
}

export default App;
