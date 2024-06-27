function get30MinIntervals(startTime, endTime) {
  // Helper function to pad single digit numbers with a leading zero
  function pad(number) {
    return number < 10 ? "0" + number : number;
  }

  // Helper function to format a Date object into 'HH:MM' format
  function formatTime(date) {
    return (
      pad(date.getHours()) +
      ":" +
      pad(date.getMinutes()) +
      ":" +
      pad(date.getSeconds())
    );
  }

  // Parse the input times into Date objects
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const [endHour, endMinute] = endTime.split(":").map(Number);

  const startDate = new Date();
  startDate.setHours(startHour, startMinute, 0, 0);

  const endDate = new Date();
  endDate.setHours(endHour, endMinute, 0, 0);

  // Generate the intervals
  const intervals = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    intervals.push(formatTime(currentDate));
    currentDate.setMinutes(currentDate.getMinutes() + 30);
  }

  return intervals;
}

export default get30MinIntervals;
