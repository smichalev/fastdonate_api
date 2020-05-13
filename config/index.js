module.exports = {
  project_name: 'FastDonate',
  socket: {
    port: 5555
  },
  db: {
    host: '127.0.0.1',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'fastdonate',
    dialect: 'postgres'
  },
  domain: 'dev.fastdonate.local',
  host: '127.0.0.1',
  port: 3000,
  authorization: {
    steamApiKey: 'BCCF96617A7EBE4D4373410F0BC1A348'
  },
  settings: {
    maxCountElementOnPage: 10,
    maxHashtags: 6
  },
  files: {
    maxSizeImage: 250000,
    maxSizeArchive: 875000,
  }
};
