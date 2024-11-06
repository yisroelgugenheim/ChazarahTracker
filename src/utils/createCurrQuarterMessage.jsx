
export function createCurrQuarterMessage (currentQuarterMinutes, currentQuarterPledge) {
    let message
    if (currentQuarterMinutes > currentQuarterPledge)  {

      message = ( <> 
      Your minutes for the current quarter: {currentQuarterMinutes} <br />
      Your pledge for the current quarter: {currentQuarterPledge}   <br />
      You are over by {currentQuarterMinutes - currentQuarterPledge} minutes! </> )
    }

    else if(currentQuarterMinutes === currentQuarterPledge ) { 
      message = ( <> 
      Your minutes for the current quarter: {currentQuarterMinutes} <br />
      Your pledge for the current quarter: {currentQuarterPledge}   <br />
      You are even! </> )
    }
    else {
      message = ( <>
      Your minutes for the current quarter: {currentQuarterMinutes} <br />
      Your pledge for the current quarter: {currentQuarterPledge}   <br />
      You are under by {currentQuarterPledge - currentQuarterMinutes} minutes! </> )
    }
    return message
    
  }  
  