export const createResultObject = (sourceData, seek, populate) => {
  let result = {};
  seek.forEach((key, idx) => {
    let foundValue;
    if (typeof sourceData !== "object" || key === "0") {
      foundValue = sourceData;
    } else {
      foundValue = sourceData[key];
    }

    console.log(`Seek key: ${key}, Found value:`, foundValue);
    if (foundValue !== undefined) {
      result[populate[idx]] = foundValue;
      console.log(`Populate key: ${populate[idx]}, Value to add:`, foundValue);
    }
  });
  console.log("Result object:", result);
  return result;
};
