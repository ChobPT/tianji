/** @type {import('@i18next-toolkit/cli').I18nextToolkitConfig} */
const config = {
  locales: ['en', 'zh', 'jp', 'fr', 'de', 'ru'],
  verbose: true,
  translator: {
    type: 'openai',
    model: 'gpt-4'
  },
  scanner: {
    autoImport: false,
    ignoreText: [
      'Tianji',
      '(25, 587)',
      'TLS (465)',
      'https://github.com/caronc/apprise/wiki#notification-services',
      'Slug',
      '--',
      'a-z',
      '0-9',
      '80',
      'example.com or 1.2.3.4',
      'TCP Port',
      'OpenAI',
      'sess-************',
      'Ping',
      'For example:&#13;&#10;{ "key": "value" }',
      'Body',
      'Headers',
      'Content-Type',
      'Method',
      'https://example.com',
      'HTTP',
      'text/xml',
      'application/x-www-form-urlencoded',
      'application/json',
      'OPTIONS',
      'HEAD',
      'DELETE',
      'PATCH',
      'PUT',
      'POST',
      'GET',
      'HH:mm',
      'YYYY-MM-DD HH:mm',
    ],
  },
};

module.exports = config;
