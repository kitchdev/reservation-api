function addMinutesToTimeString(timeString, minutesToAdd) {
  console.log(timeString);
  console.log(minutesToAdd);
  // Split the time string into hours, minutes, and seconds
  let [hours, minutes, seconds] = timeString.split(":").map(Number);

  // Create a new Date object with the current date and specified time
  let date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(seconds);

  // Add the minutes
  date.setMinutes(date.getMinutes() + minutesToAdd);

  // Format the resulting time back into a string
  let newHours = String(date.getHours()).padStart(2, "0");
  let newMinutes = String(date.getMinutes()).padStart(2, "0");
  let newSeconds = String(date.getSeconds()).padStart(2, "0");

  return `${newHours}:${newMinutes}:${newSeconds}`;
}

export default addMinutesToTimeString;
