/**
 * Created by szhitenev on 10.08.2023.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            scope: {
                diameter: '@',
                frontLineColor: '@',
                backLineColor: '@'
            },
            templateUrl: 'views/directives/initial-loader-view.html',
            link: function (scope, elem) {
                
                const phrases = [
                    "Retrieving Data",
                    "Gathering Information",
                    "Fetching Records",
                    "Acquiring Data",
                    "Loading Information",
                    "Collecting Data",
                    "Populating Database",
                    "Initializing Records",
                    "Importing Content",
                    "Compiling Data",
                    "Initializing Data",
                    "Preparing Information",
                    "Loading Content",
                    "Gathering Details",
                    "Importing Records",
                    "Loading Data",
                    "Assembling Content",
                    "Loading Resources",
                    "Gathering Insights",
                    "Preparing Records",
                    "Setting Up Information",
                    "Synchronizing Data",
                    "Loading Records",
                    "Getting Things Ready",


                    "Embarking on a cosmic journey",
                    "Preparing for liftoff",
                    "Counting down to launch",
                    "Navigating the starry data",
                    "Exploring the data universe",
                    "Syncing with the constellations",
                    "Commencing interstellar data flow",
                    "Engaging warp speed data retrieval",
                    "Connecting with data satellites",
                    "Synchronizing with distant data planets",
                    "Venturing through the data galaxies",
                    "Mapping the data starfields",
                    "Capturing data comet trails",
                    "Orbiting the data moon",
                    "Navigating through celestial data clouds",
                    "Collecting data meteorites",
                    "Harvesting data from the cosmic stream",
                    "Diving into the data black hole",
                    "Analyzing data supernovas",
                    "Reaching for the data stars",
                ];

                // Function to get a random phrase from the list
                function getRandomPhrase() {
                    const randomIndex = Math.floor(Math.random() * phrases.length);
                    return phrases[randomIndex];
                }

                scope.phrase = getRandomPhrase();

                scope.init = function () {

                    setTimeout(function () {

                        loadStarsPreset(tsParticles).then(function () {

                            window.tsParticles.load("tsparticles", {preset: "stars"});

                        })

                    }, 100);


                }

                scope.init();

            }
        }
    }


}());