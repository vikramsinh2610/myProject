export const devLog = (...data: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(data);
  }
};

export const devLogError = (...data: any) => {
  if (process.env.NODE_ENV === "development") {
    console.error(data);
  }
};
