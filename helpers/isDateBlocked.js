async function isDateBlocked(client, date) {
  const res = await client.query(
    "SELECT * FROM Blocked_Dates WHERE blocked_date = $1",
    [date]
  );
  return res.rows.length > 0;
}

export default isDateBlocked;
