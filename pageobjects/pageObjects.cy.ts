
export function interceptRacesListCall () {

    // force all API calls to be not cached from the disk, which causes failures with quick succession of local runs
    cy.intercept(
        `/v2/racing/next-races-category-group*`,
        (req) => {
            req.on('before:response', (response) => {
                response.headers['cache-control'] = 'no-store'
            })
        }
    ).as('getRaces')

}


// get sorted list of races providing the time to start in seconds
export function getRacesList (data) {

    const racesDataAll = data.response.body.race_summaries;
    assert.isNotNull(racesDataAll, 'Races data was received');

    let racesList = [];

    // get current Unix Epoch time
    const currentTimestamp = new Date().getTime();

    // extract test data into an array
    for (const key of Object.keys(racesDataAll)) {
        // Array [Time in seconds, Category, Race number, Venue]
        racesList.push([racesDataAll[key].advertised_start, racesDataAll[key].category_id, racesDataAll[key].race_number, racesDataAll[key].meeting_name]);
    }

    // sort by date then find difference between local epoch timestamp and time to jump
    racesList.sort();
    racesList.forEach(race => {
        race[0] = (new Date(race[0]).getTime() - currentTimestamp) / 1000;
    })

    return racesList;
}

export function checkAPIRacesvsDisplayed (racesList) {

    // checking the race data displayed against received from API iterating until 5 races are found and compared
    // Array [Time in seconds, Category, Race number, Venue]
    let countedRaces = 0;
    for(let raceNumber = 0; raceNumber < racesList.length; raceNumber++){

        if (racesList[raceNumber][0] > -301) {

            let timeMin = Math.trunc(racesList[raceNumber][0] / 60);
            let timeSec = Math.floor(racesList[raceNumber][0] % 60);
            let timerDisplayed;
            if ((Math.abs(racesList[raceNumber][0]) > 299) || (timeSec == 0)) timerDisplayed = `${timeMin}m`;
            if ((Math.abs(racesList[raceNumber][0]) < 301) && (Math.abs(racesList[raceNumber][0]) >= 60) && (timeSec != 0)) timerDisplayed = `${timeMin}m ${Math.abs(timeSec)}s`;
            if (Math.abs(racesList[raceNumber][0]) < 60) timerDisplayed = `${timeSec}s`;
            if (Math.abs(racesList[raceNumber][0]) == 60) timerDisplayed = `0s`;

            // comparing API values with displayed on the screen. Due to the fact that times to start might be the same, check needs to be performed for one element before and after
            // I know that this part could be done better, and other parts refactored, but given late hour, I decided it would more sense to deliver what I have sooner than later, even with imperfection
            if ((raceNumber > 0) && (raceNumber < racesList.length -1 )) {
                cy.get('.item').eq(countedRaces).invoke('text').should('be.oneOf', [`R${racesList[raceNumber][2]}${racesList[raceNumber][3]}${timerDisplayed}`, `R${racesList[raceNumber - 1][2]}${racesList[raceNumber - 1][3]}${timerDisplayed}`, `R${racesList[raceNumber + 1][2]}${racesList[raceNumber + 1][3]}${timerDisplayed}`]);
            }
            // first element doesn't have previous to compare with
            if (raceNumber == 0) {
                cy.get('.item').eq(countedRaces).invoke('text').should('be.oneOf', [`R${racesList[raceNumber][2]}${racesList[raceNumber][3]}${timerDisplayed}`, `R${racesList[raceNumber + 1][2]}${racesList[raceNumber + 1][3]}${timerDisplayed}`]);
            }
            // last element doesn't have next to compare with
            if ((raceNumber == racesList.length -1 )) {
                cy.get('.item').eq(countedRaces).invoke('text').should('be.oneOf', [`R${racesList[raceNumber][2]}${racesList[raceNumber][3]}${timerDisplayed}`, `R${racesList[raceNumber -1][2]}${racesList[raceNumber - 1][3]}${timerDisplayed}`]);
            }

            countedRaces++;
        }
        if (countedRaces == 5) break;

    }
}

