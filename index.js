const request = require('superagent');

const MAGIC = /var (seasonInfo|playerData) = (.*);/g;

const SearchPlayer = (config) => {
  function extractData(html) {
    const output = {};
  
    while (match = MAGIC.exec(html)) {
      if (match) {
        const [, dataType, data] = match;
        try {
          output[dataType] = JSON.parse(data);
        } catch (error) {
          console.error(`Error parsing ${dataType} =>`, data);
          throw error;
        }
      }
    }
  
    return output;
  }

  function requestData(playerName) {
    const url = [config.host, config.path, playerName].join('/');
    const requestTime = Date.now();
  
    return request(url)
      .then((response) => extractData(response.text))
      .then((data) => Object.assign(data, {time: Date.now() - requestTime}));
  }

  return requestData;
}

module.exports = SearchPlayer;

// **** TEST ****

const _config = {
  host: 'https://pubgtracker.com',
  path: 'profile/pc'
};

SearchPlayer(_config)('javilobo8').then(console.log);
