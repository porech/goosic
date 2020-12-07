import React from "react";
import { useSelector } from "react-redux";
import { getOptions } from "../state/options";
const Options = () => {
  var opts = useSelector(getOptions);
  opts = [{ label: "option1", type: "select" }];
  return (
    <div className="options">
      <ul>
        {opts.map((opt) => {
          return (
            <>
              <li>
                {opt.label}
                {opt.type && opt.type === "select" && (
                  <input type="checkbox" placeholder="lol"></input>
                )}
              </li>
            </>
          );
        })}
      </ul>
    </div>
  );
};
export default Options;
