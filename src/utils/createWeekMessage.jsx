export function createWeekMessage(weekMinutes, pledge) {
  let message;
  if (weekMinutes > pledge) {
    message = (
      <>
        Your minutes for the week: {weekMinutes} <br />
        So far this week you owe: {pledge} <br />
        You are over by {weekMinutes - pledge} minutes!{" "}
      </>
    );
  } else if (weekMinutes === pledge) {
    message = (
      <>
        Your minutes for the week: {weekMinutes} <br />
        So far this week you owe: {pledge} <br />
        You are even!{" "}
      </>
    );
  } else {
    message = (
      <>
        Your minutes for the week: {weekMinutes} <br />
        So far this week you owe:{pledge} <br />
        You are under by {pledge - weekMinutes} minutes!{" "}
      </>
    );
  }
  return message;
}
