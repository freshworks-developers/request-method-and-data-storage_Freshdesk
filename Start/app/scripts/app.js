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

// saveInDataStorage function goes here

// fetchFromDataStorage function goes here

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
