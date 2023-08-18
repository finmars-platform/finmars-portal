/**
 * Created by szhitenev on 10.08.2023.
 */
(function () {

    'use strict';

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                diameter: '@',
                frontLineColor: '@',
                backLineColor: '@'
            },
            templateUrl: 'views/directives/initial-loader-view.html',
            link: function (scope, elem) {
                
                const phrases = [
                    // Technical/Database-themed Phrases
                    "Processing Data",
                    "Updating Records",
                    "Querying Information",
                    "Pulsing Data Streams",
                    "Refreshing Content",
                    "Analyzing Information",
                    "Reading Database",
                    "Validating Data Integrity",
                    "Storing New Entries",
                    "Generating Data Snapshots",
                    "Optimizing Database",
                    "Extracting Data Points",
                    "Receiving Data Packets",
                    "Sending Information",
                    "Uploading Details",
                    "Building Data Structures",
                    "Establishing Connection",
                    "Linking Data Nodes",
                    "Buffering Records",
                    "Safeguarding Data",
                    "Translating Data Streams",
                    "Reformatting Records",
                    "Consolidating Information",
                    "Deploying Data Solutions",
                    "Patching Records",
                    "Mapping Data Flow",
                    "Categorizing Information",
                    "Structuring Database",
                    "Replicating Data",
                    "Scanning Records",
                    "Auditing Data Trails",
                    "Preserving Content",
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

                    // Cosmic/Space-themed Phrases
                    "Surfing the data waves",
                    "Plotting the data trajectory",
                    "Cosmic data transfer in progress",
                    "Propelling through the data space",
                    "Setting coordinates to data destinations",
                    "Aligning with data star clusters",
                    "Receiving data transmissions from space",
                    "Stargazing at the data night sky",
                    "Discovering new data constellations",
                    "Warping through data dimensions",
                    "Fueling up the data rocket",
                    "Floating in the data nebula",
                    "Journeying to data exoplanets",
                    "Decoding intergalactic data signals",
                    "Bridging cosmic data realms",
                    "Listening to data echoes of the universe",
                    "Pioneering through data asteroids",
                    "Wandering the data Milky Way",
                    "Accelerating towards data horizons",
                    "Tuning into data cosmic radio",
                    "Studying data space anomalies",
                    "Deciphering celestial data codes",
                    "Chasing data quasars",
                    "Exploring data wormholes",
                    "Measuring data cosmic rays",
                    "Observing data pulsars",
                    "Embarking on a data odyssey",
                    "Crossing the data event horizon",
                    "Energizing data reactors",
                    "Tapping into the data matrix",
                    "Drawing power from data suns",
                    "Soaring through data cosmos",
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