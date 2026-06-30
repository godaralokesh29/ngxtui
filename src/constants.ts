export const CONSTANTS = {
  NGINX_BINARY: 'nginx',
  CONF_PATH_ARG: '--conf-path=',
  CONF_FILE_NAME: 'nginx.conf',
  DIR_SITES_AVAILABLE: 'sites-available',
  DIR_SITES_ENABLED: 'sites-enabled',
  DEFAULT_CONF: `worker_processes auto;\n\nevents { worker_connections 1024; }\n\nhttp {\n    include /etc/nginx/mime.types;\n    default_type application/octet-stream;\n\n    sendfile on;\n    keepalive_timeout 65;\n\n    include /etc/nginx/conf.d/*.conf;\n    include /etc/nginx/sites-enabled/*;\n}\n`,
};
