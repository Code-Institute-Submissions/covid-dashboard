// Function for Formatting Table Data for requested countries
function formatTableData() {

    // Obtain countries selected from dropdown menus
    let firstTargetCountry = $("#firstCountrySelect").val();
    let secondTargetCountry = $("#secondCountrySelect").val();

    let firstTargetCountryIndex;
    // If if first country is not default value
    if (firstTargetCountry !== "none") {
        // Find the index position of the requested country within the global compare dataset
        firstTargetCountryIndex = globalCompareDataset.findIndex(function (entry) {
            return entry.country == firstTargetCountry;
        });
    }

    let secondTargetCountryIndex;
    // If the second country is not default value
    if (secondTargetCountry !== "none") {
        // Find the index position of the requested country within the global compare dataset
        secondTargetCountryIndex = globalCompareDataset.findIndex(function (entry) {
            return entry.country == secondTargetCountry;
        });
    }

    // Obtain the list of keys for the compare dataset (statistic names)
    let statisticsKey = Object.keys(globalCompareDataset[0]);

    // Initiate HTML
    let outputHTML = "";

    // For each key, generate the appropriate value for each country, and append to HTML
    statisticsKey.forEach(function (el) {

        // Checks the statistic is not "Null" in the dictionary, otherwise skips
        if (statisticDictionary[el] !== null) {

            // declare the data variables for each country's statistic 
            let firstCountryData;
            let secondCountryData;

            // Checks whether the target country is the default (Select a Country), and set the value to an empty string if so.
            if (firstTargetCountry == "none") {
                firstCountryData = "";
            } else if (secondTargetCountry == "none") {
                secondCountryData = "";
            }

            // Checks whether the statistic is "updated", and if so converts the responses to shorthand date format.
            // https://stackoverflow.com/questions/8043026/how-to-format-numbers-by-prepending-0-to-single-digit-numbers
            if (el === "updated") {

                if (firstTargetCountry !== "none") {
                    firstCountryData = new Date(globalCompareDataset[firstTargetCountryIndex][el]);
                    firstCountryData = firstCountryData.toDateString() + " " + firstCountryData.getHours() + ":" + (("0" + firstCountryData.getMinutes()).slice(-2));
                }
                if (secondTargetCountry !== "none") {
                    secondCountryData = new Date(globalCompareDataset[secondTargetCountryIndex][el]);
                    secondCountryData = secondCountryData.toDateString() + " " + secondCountryData.getHours() + ":" + (("0" + secondCountryData.getMinutes()).slice(-2));
                }

                // Checks whether the statistic is "country", and if so returns raw string.
            } else if (el == "country") {
                if (firstTargetCountry !== "none") {
                    firstCountryData = globalCompareDataset[firstTargetCountryIndex][el];
                }
                if (secondTargetCountry !== "none") {
                    secondCountryData = globalCompareDataset[secondTargetCountryIndex][el];
                }

                // Otherwise, returns a locale formatted number string (i.e comma seperated) along with respective formatting for bigger/smaller values
            } else {

                let firstCountryNumber;
                let secondCountryNumber;

                // First Country
                if (firstTargetCountry !== "none") {
                    // Define number variables for each country, for later calculation and referencing
                    firstCountryNumber = globalCompareDataset[firstTargetCountryIndex][el];

                    // Checks to see whether the value returned isn't "Null"
                    if (firstCountryNumber) {
                        // Assign the "Data" variables the string locale formatted number
                        firstCountryData = Number(firstCountryNumber).toLocaleString();
                    } else {
                        // Sets the string to a dash if no data available for the given statistic.
                        firstCountryData = "-";
                    }
                }

                // Second Country
                if (secondTargetCountry !== "none") {
                    // Define number variables for each country, for later calculation and referencing
                    secondCountryNumber = globalCompareDataset[secondTargetCountryIndex][el];

                    // Checks to see whether the value returned isn't "Null"
                    if (secondCountryNumber) {
                        // Assign the "Data" variables the string locale formatted number
                        secondCountryData = Number(secondCountryNumber).toLocaleString();
                    } else {
                        // Sets the string to a dash if no data available for the given statistic.
                        secondCountryData = "-";
                    }
                }

                // If neither of the values are default, and if both country data is available, add the symbols for <>=
                if (((firstTargetCountry !== "none") || (secondTargetCountry !== "none")) && ((firstCountryData !== "-") && (secondCountryData !== "-"))) {

                    // Determine which number is larger, and format styling accordingly.
                    if (firstCountryNumber > secondCountryNumber) {

                        // Style for if first Country number is larger
                        firstCountryData = '<i class="fas fa-long-arrow-alt-up"></i> ' + firstCountryData;
                        secondCountryData = secondCountryData + ' <i class="fas fa-long-arrow-alt-down"></i>';

                    } else if (firstCountryNumber < secondCountryNumber) {

                        // Style for if second Country number is larger
                        firstCountryData = '<i class="fas fa-long-arrow-alt-down"></i> ' + firstCountryData;
                        secondCountryData = secondCountryData + ' <i class="fas fa-long-arrow-alt-up"></i>';
                    } else if (firstCountryNumber == secondCountryNumber) {

                        // Style for if numbers are the same
                        firstCountryData = '<i class="fas fa-equals"></i> ' + firstCountryData;
                        secondCountryData = secondCountryData + ' <i class="fas fa-equals"></i>';
                    }
                }
            }

            // Add the Data variables for first and second countries to a table row, obtain relevant string from dictionairy, and add to existing html output
            outputHTML += ` <tr><td>${firstCountryData}</td><td><strong>${statisticDictionary[el]}</strong></td><td>${secondCountryData}</td></tr >`;
        }
    });

    // Set Output field to "output HTML" as generated above.
    $("#covidTableBody").html(outputHTML);
}

// On either country select changing
$("#firstCountrySelect").add("#secondCountrySelect").on('change', function () {

    // If both values are default
    if ($("#firstCountrySelect").val() == "none" && $("#secondCountrySelect").val() == "none") {
        // Reset the section
        $(".table-heading").html("");
        $("#covidCompare .text-container").removeClass("d-none");
        $("#covidTableBody").html("");
    } else {
        // Check if the text-container still exists, if so remove it
        if (!$("#covidCompare .text-container").hasClass("d-none")) {
            $("#covidCompare .text-container").addClass("d-none");
            $(".table-heading").html("Statistic");
        }
        // Otherwise, perform search function to update table.
        formatTableData();
    }
});