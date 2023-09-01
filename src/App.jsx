import React, { useState } from "react";
import "./App.scss";
// import eventData from "./JsonFile/event.json";

const App = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("UTC");
  const daysOfWeek = ["Mon", "Tues", "Wed", "Thu", "Fri"];
  const startHour = 8;
  const endHour = 23;
  const halfHourIntervals = [];

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const period = hour < 12 ? "AM" : "PM";
      const time = hour % 12 || 12;
      const half = minute === 0 ? "00" : "30";

      halfHourIntervals.push({
        time,
        period,
        half,
      });
    }
  }

  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const changeWeek = (daysToAdd) => {
    setCurrentDate(
      new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000)
    );
  };

  const convertToSelectedTimezone = (hour, period, half) => {
    let offset = 0;
    if (selectedTimezone === "UTC+5:30") {
      offset = 5 * 60 + 30;
    }

    const utcTime = new Date(
      0,
      0,
      0,
      period === "PM" ? hour + 12 : hour,
      half,
      0,
      0
    );
    const localTime = new Date(utcTime.getTime() + offset * 60 * 1000);

    const options = {
      hour12: true, // Display in 12-hour format
      hour: "numeric",
      minute: "numeric",
    };
    return localTime.toLocaleTimeString("en-US", options);
  };

  return (
    <div>
      <div className="weekBtns">
        <button onClick={() => changeWeek(-7)} className="btns">
          Previous Week
        </button>
        <span>{currentDate.toDateString()}</span>
        <button onClick={() => changeWeek(7)} className="btns">
          Next Week
        </button>
      </div>

      <div className="timezone">
        <label>Timezone:</label>
        <select value={selectedTimezone} onChange={handleTimezoneChange}>
          <option value="UTC+0">UTC-0</option>
          <option value="UTC+5:30">UTC+5:30</option>
        </select>
      </div>
      <table>
        <tbody>
          {daysOfWeek.map((day, index) => {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(
              startOfWeek.getDate() - startOfWeek.getDay() + index + 1
            );
            const formattedDate = startOfWeek.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            });

            return (
              <tr key={day}>
                <td className="weekName">
                  <p>{day}</p> {formattedDate}
                </td>
                <div className="checkboxContainer">
                  {halfHourIntervals.map(({ time, period, half }) => (
                    <td
                      className="checkboxWrapper"
                      key={`${day}-${time}${period}${half}`}
                    >
                      <input
                        type="checkbox"
                        name={`checkbox-${day}-${time}${period}${half}`}
                        id={`checkbox-${day}-${time}${period}${half}`}
                      />
                      <label
                        htmlFor={`checkbox-${day}-${time}${period}${half}`}
                      >
                        {convertToSelectedTimezone(time, period, half)}
                      </label>
                    </td>
                  ))}
                </div>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default App;
