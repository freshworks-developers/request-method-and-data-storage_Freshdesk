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
async function fetchData() {
  // API endpoint to fetch the current location of the International Space Station defined in config/requests.json
  try {
    let location = await client.request.invokeTemplate("getDataFromISS", {})
    await saveInDataStorage({ 'latitude': JSON.parse(location.response).latitude, 'longitude': JSON.parse(location.response).longitude })
  } catch (error) {
    handleErr(error)
  }
}

// saveInDataStorage function goes here

/**
 * Function to save the location in data storage
 * @param {*} data Object
 */
async function saveInDataStorage(location) {
  try {
    let response = await client.db.set("location", location)
    showNotify("success", "Location saved successfully in the Data Storage");
    console.log(response)
  } catch (error) {
    handleErr(error)
  }
}

// fetchFromDataStorage function goes here

/**
 * Function to fetch the location of International space station 
 */
async function fetchFromDataStorage() {
  try {
    let location = await client.db.get("location")
    showNotify('success', `The location ISS from the Data Storage is Latitude: ${location.latitude} , Longitude: ${location.longitude}`)
    console.info('data', location);
  } catch (error) {
    handleErr(error)
  }
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
