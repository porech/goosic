const Time = ({children}) => {
        let minutes = Math.trunc(children / 60);
        let seconds = children - 60 * minutes;
        let trailingZeroForMinutes = minutes < 10 ? true : false;
        let trailingZeroForSeconds = seconds < 10 ? true : false;
        return `${
          children
            ? (trailingZeroForMinutes ? "0" : "") +
              minutes +
              ":" +
              (trailingZeroForSeconds ? "0" : "") +
              seconds
            : "--:--"
        }`;

}

export default Time;