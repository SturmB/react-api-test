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

export function DataTable({ headers, data, order, numColumns, numType }) {
  const styleGrid = {
    gridTemplateColumns: `repeat(${numColumns}, auto)`,
    gridTemplateRows: `repeat(${data.length + 2}, auto)`,
  };
  const firstHeader = {
    gridArea: `1 / 1 / span 2 / span 1`,
  };
  const lastHeader = {
    gridArea: `1 / ${numColumns} / span 2 / span 1`,
  };

  return (
    <div className="grid fs-5" style={styleGrid}>
      <div className="cell-brand rounded-start" style={firstHeader}>
        {headers[0].name}
      </div>
      {headers.map((store, storeIndex) => {
        if (store.hasOwnProperty(`months`)) {
          const colspan = store.months.length;
          const startLine = (storeIndex - 1) * colspan + 2;
          const styleColSpan = {
            gridArea: `1 / ${startLine} / 2 / span ${colspan}`,
          };
          return (
            <>
              <div key={store.name} className="cell-store" style={styleColSpan}>
                {store.name}
              </div>
              {store.months.map((month, monthIndex, monthArray) => {
                const styleMonth = {
                  gridArea: `2 / ${startLine + monthIndex} / 3 / ${
                    startLine + monthIndex + 1
                  }`,
                };
                let borderClass = `cell-month`;
                if (monthIndex === monthArray.length - 1) {
                  borderClass = `cell-month gap-right`;
                }
                return (
                  <div
                    key={store.name + `-` + month}
                    className={borderClass}
                    style={styleMonth}
                  >
                    {month}
                  </div>
                );
              })}
            </>
          );
        }
        return null;
      })}
      <div className="cell-total rowspan2 rounded-end" style={lastHeader}>
        {headers[headers.length - 1].name}
      </div>
      {data.map((row, rowIndex) => {
        const startLine = rowIndex + 3;
        const styleDataRow = {
          gridRow: `${startLine} / span 1`,
        };
        // noinspection JSUnresolvedVariable
        return (
          <>
            <div className="cell-brand-name rounded-start text-start" style={styleDataRow}>
              {row.brand}
            </div>
            {order.map((item) => {
              if (numType === `Count`) {
                // noinspection JSUnresolvedVariable
                return (
                  <div
                    key={row.brand + item}
                    className="cell-data"
                    style={styleDataRow}
                  >
                    {convertCount(row[item])}
                  </div>
                );
              }
              // noinspection JSUnresolvedVariable
              return (
                <div
                  key={row.brand + item}
                  className="cell-data"
                  style={styleDataRow}
                >
                  {row[`${item}_percent`]}%
                </div>
              );
            })}
            <div className="cell-brand-total rounded-end" style={styleDataRow}>
              {numType === `Count`
                ? convertCount(row.total)
                : `${row.total_percent}%`}
            </div>
          </>
        );
      })}
    </div>
  );
}

export function ToggleGroup({ numTypes, numType, setNumType }) {
  return (
    <div
      className="btn-group px-5 py-3"
      role="group"
      aria-label="Switch between number types"
    >
      {numTypes.map((type) => (
        <button
          key={type}
          type="button"
          className={`btn text-uppercase ${
            type === numType ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setNumType(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

function App() {
  const numTypes = [`Count`, `Percent`];

  const [allBrands, setAllBrands] = useState(null);
  const [numType, setNumType] = useState(numTypes[0]);

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
            <span className="h5 fw-bold">Store Summary</span>
            <ToggleGroup
              numTypes={numTypes}
              numType={numType}
              setNumType={setNumType}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <DataTable
              headers={capitalized}
              data={allBrands.data}
              order={dataOrder}
              numColumns={columnsRaw.length}
              numType={numType}
            />
          </div>
        </div>

      </div>
    );
  }

  return <div>No data available.</div>;
}

export default App;
