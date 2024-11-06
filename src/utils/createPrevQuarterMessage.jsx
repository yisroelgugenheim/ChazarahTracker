export function createPrevQuarterMessage (prevQuarterMinutes, prevQuarterPledge) {
    let message
    if (prevQuarterMinutes > prevQuarterPledge)  {

      message = ( <> 
      Your minutes for the previous quarter: {prevQuarterMinutes} <br />
      Your pledge for the previous quarter: {prevQuarterPledge}   <br />
      You are over by {prevQuarterMinutes - prevQuarterPledge} minutes! </> )
    }

    else if(prevQuarterMinutes === prevQuarterPledge ) { 
      message = ( <> 
      Your minutes for the previous quarter: {prevQuarterMinutes} <br />
      Your pledge for the previous quarter: {prevQuarterPledge}   <br />
      You are even! </> )
    }
    else {
      message = ( <>
      Your minutes for the previous quarter: {prevQuarterMinutes} <br />
      Your pledge for the previous quarter: {prevQuarterPledge}   <br />
      You are under by {prevQuarterPledge - prevQuarterMinutes} minutes! </> )
    }
    return message
    
  }  