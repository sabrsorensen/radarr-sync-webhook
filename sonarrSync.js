const axios = require('axios');

const src = {
  host: process.env.SONARR_SRC_HOST,
  apikey: process.env.SONARR_SRC_APIKEY,
  root: process.env.SONARR_SRC_ROOT,
};

const dst = {
  host: process.env.SONARR_DST_HOST,
  apikey: process.env.SONARR_DST_APIKEY,
  root: process.env.SONARR_DST_ROOT,
};

const log = (message, title) => {
  const msg = title ? `${title}: ${message}` : message;
  console.log(msg);
  return msg;
};

const addSeries = (json, profile) => {
  if (!json.episodeFileCount === 0) {
    return log('Not downloaded. Skipping.', json.title);
  }
  const {
    title, titleSlug, tvdbId
  } = json;
  const path = json.path.replace(src.root, dst.root);
  const qualityProfileId = parseInt(profile, 10);
  if (Number.isNaN(qualityProfileId)) {
    return log(`Quality profile id must be an integer. Got '${profile}'`);
  }
  const payload = {
    title,
    titleSlug,
    tvdbId,
    path,
    qualityProfileId,
    seasons: [],
    images: [],
    monitored: true,
    addOptions: {
      searchForMissingEpisodes: true,
      monitor: "all",
    },
  };

  return axios.post(`${dst.host}/api/v3/series?apikey=${dst.apikey}`, payload)
    .then(() => log('Synced!', title))
    .catch(() => log('Unable to add series', title));
};

const sonarrSync = ({ id, profile }) => axios.get(`${src.host}/api/v3/series/${id}?apikey=${src.apikey}`)
  .then((data) => {
    if (data.message === 'Not Found') {
      return log(`Movie id not found: ${id}`);
    }
    return addSeries(data.data, profile);
  });

const sonarrImportAll = ({ profile }) => axios.get(`${src.host}/api/v3/series?apikey=${src.apikey}`)
  .then(data => data.data.map(d => addSeries(d, profile)).filter(series => series));

module.exports = { sonarrSync, sonarrImportAll };
