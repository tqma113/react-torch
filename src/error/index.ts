import React from "react";

export const createErrorElement = (err: string) => {
  return React.createElement("div", {
    children: err,
  });
};
