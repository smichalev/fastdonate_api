module.exports = {
  project_name: 'FastDonate',
  db: {
    host: '127.0.0.1',
    port: 5432,
    username: 'fastdonate',
    password: 'Xx1820082916',
    database: 'fastdonate',
    dialect: 'postgres'
  },
  domain: 'dev.fastdonate.local',
  host: '127.0.0.1',
  port: 3000,
  authorization: {
    secretKey: 'supersecretjwtkeyintheworld',
    steamApiKey: 'BCCF96617A7EBE4D4373410F0BC1A348'
  },
  settings: {
    maxCountElementOnPage: 10,
    maxHashtags: 6
  }
};
