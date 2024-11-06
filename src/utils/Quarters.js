import * as KosherZmanim from "kosher-zmanim";
// eslint-disable-next-line no-unused-vars
import {DateTime} from "luxon";

const jewishCalendar = new KosherZmanim.JewishCalendar();

while (jewishCalendar.getYomTovIndex() !== KosherZmanim.JewishCalendar.SIMCHAS_TORAH)
  jewishCalendar.back();

export const simchasTorahDate = jewishCalendar.getDate();

export let yearStart = simchasTorahDate;
while (yearStart.weekdayLong !== "Sunday")
  yearStart = yearStart.plus({ days: 1 });

/**
 * @type {DateTime<DefaultValidity>[]}
 */
const quarterEndDates = [
  yearStart.plus({ weeks: 12 }),
  yearStart.plus({ weeks: 24 }),
  yearStart.plus({ weeks: 36 }),
  yearStart.plus({ weeks: 56 }),
];

function partitionUserQuarters({ sessions, payments, pledged_minutes, ...rest }) {
  const quarterObligation = (quarter) => {
    const pledge = pledged_minutes * 12 * quarter;

    const quarterEndDate = quarterEndDates[quarter - 1];

    const sessionSum = sessions.reduce(
      (acc, { created_at, session_length }) => {
        const sessionDate = new Date(created_at);
        return sessionDate < quarterEndDate ? acc + session_length : acc;
      },
      0
    );
    const paymentSum = payments.reduce((acc, { created_at, amount }) => {
      const paymentDate = new Date(created_at);
      return paymentDate < quarterEndDate ? acc + amount : acc;
    }, 0);

    return pledge - sessionSum - paymentSum;
  };

  return {
    ...rest,
    quarters: [
      quarterObligation(1),
      quarterObligation(2),
      quarterObligation(3),
      quarterObligation(4),
    ],
  };
}

/**
 * @param {number} quarterIndex 0-based quarter index
 * @returns {[string, string]}
 */
function quarterRange(quarterIndex) {
  let startDate =
    quarterIndex === 0 ? yearStart : quarterEndDates[quarterIndex - 1];
  let endDate =
    quarterEndDates[quarterIndex].minus({ days: 1 });
  return [startDate, endDate]
    .map(d => d.toLocaleString());
}

/**
 * @type {([string,string])[]}
 */
const quarterRanges = [
  quarterRange(0),
  quarterRange(1),
  quarterRange(2),
  quarterRange(3),
];


/**
 * @param {[string,string]} range
 * @returns {string}
 */
function joinWithEnDash(range) {
  return range.join(" – ");
}

/**
 * @type {string[]}
 */
const quarterRangeStrings = quarterRanges.map(joinWithEnDash)

export {partitionUserQuarters, quarterRanges, quarterRangeStrings};
