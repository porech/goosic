const Time = ({ children }) => {
  const time = Math.round(children);
  let minutes = Math.trunc(time / 60);
  let seconds = time - 60 * minutes;
  let trailingZeroForMinutes = minutes < 10 ? true : false;
  let trailingZeroForSeconds = seconds < 10 ? true : false;
  return `${
    time
      ? (trailingZeroForMinutes ? "0" : "") +
        minutes +
        ":" +
        (trailingZeroForSeconds ? "0" : "") +
        seconds
      : "--:--"
  }`;
};

export default Time;
