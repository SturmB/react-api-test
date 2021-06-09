import { render, screen } from "@testing-library/react";
import App, { splitArray, properName, convertMonth, convertMonths, convertCount } from "./App";

// test(`gets store name only from raw string`, () => {
//   expect(getStore(`best_buy_202101_percent`, /\d{6}/)).toMatch(/best_buy/);
// });

test(`turns raw string into 2D array`, () => {
  const array = [
    `brand`,
    `best_buy_202101`,
    `best_buy_202102`,
    `best_buy_202103`,
    `lowes_202101`,
    `lowes_202102`,
    `lowes_202103`,
  ];
  expect(splitArray(array)[1]).toHaveProperty(`name`, `best_buy`);
  expect(splitArray(array)[1]).toHaveProperty(
    `months`,
    expect.arrayContaining([`202101`])
  );
});

test(`capitalizes every word in phrase`, () => {
  expect(properName(`best_buy`)).toMatch(/Best Buy/);
});

test(`converts raw number into 3-letter month abbreviation`, () => {
  expect(convertMonth(`202102`)).toMatch(`Feb`);
});

test(`converts array of raw numbers into 3-letter month abbreviations`, () => {
  expect(convertMonths([`202101`, `202102`, `202103`])).toEqual([`Jan`, `Feb`, `Mar`]);
});

test(`converts number or string to a formatted string representation of a number`, () => {
  expect(convertCount(`2846`)).toMatch(/2,846/);
  expect(convertCount(2846)).toMatch(/2,846/);
});