var client;



document.onreadystatechange = function () {
  if (document.readyState === 'interactive') renderApp();

  function renderApp() {
    var onInit = app.initialized();

    onInit.then(getClient).catch(handleErr);

    function getClient(_client) {
      client = _client;
      client.events.on('app.activated', onAppActivate);
    }
  }
};


function onAppActivate() {

  // Bind the html button with ID 'fetch' to the fwClick event
  document.getElementById('fetch').addEventListener('fwClick', fetchData)

  // Bind the html button with ID 'save' to the fwClick event
  document.getElementById('save').addEventListener('fwClick', fetchFromDataStorage)
}



// fetchData() Function Goes Here

/**
 * Function to Fetch location of International Space Station from the REST API
 * 
 */
function fetchData() {

  // API endpoint to fetch the current location of the International Space Station
  const API_BASE_URL = "https://api.wheretheiss.at/v1/satellites/25544/positions"

  // Timestamp for current time to get the location of International Space Station for a specified time. 
  const timestamp = new Date().getTime()

  // HTTP request header
  const headers = {
    "Content-Type": "application/json"
  }

  // Options passed to the request method, consists of header, body and other objects with multiple functionalities
  const options = {
    headers
  }

  // HTTP request to get the date from the 
  client.request.get(`${API_BASE_URL}?timestamps=${timestamp}&units=miles`, options)
    .then(
      function (location) {

        // Invoke the saveInDataStorage(data) function to save the location in the data storage
        saveInDataStorage({ 'latitude': JSON.parse(location.response)[0].latitude, 'longitude': JSON.parse(location.response)[0].longitude })
      },
      function (error) {

        // Error handling
        handleErr(error)
      }
    );
}

// saveInDataStorage function goes here

/**
 * Function to save the location in data storage
 * @param {*} data Object
 */
function saveInDataStorage(location) {

  client.db.set("location", location).then(
    function (data) {
      showNotify("success", "Location saved successfully in the Data Storage");
      console.info(data);
    },
    function (error) {
      // failure operation
      console.log(error)
    });
}

// fetchFromDataStorage function goes here

/**
 * Function to fetch the location of International space station 
 */
function fetchFromDataStorage() {
  client.db.get("location").then(
    function (data) {
      showNotify('success', `The location ISS from the Data Storage is Latitude: ${data.latitude} , Longitude: ${data.longitude}`)
      console.info('data', data);
    },
    function (error) {
      handleErr(error)
    });
}

/**
 * Function to show to the notification to the User
 * @param {String} type Message type (success | warning | error)
 * @param {String} message Message string to be displayed in the notification
 */
function showNotify(type, message) {
  client.interface.trigger("showNotify", {
    type: type,
    message: message
  })
}

/**
 * Function to handle error
 * @param {Object} error error object to be printed in the console
 */
function handleErr(error) {
  console.error(`Error occured. Details:`, error);
}
