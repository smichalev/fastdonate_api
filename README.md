# nginx conf

```
server {
    listen 80;
    server_name dev.fastdonate.local;
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    location ~* ^/api/ {
        proxy_buffer_size         64k;
        proxy_buffering           on;
        proxy_buffers             4 64k;
        proxy_connect_timeout     5s;
        proxy_ignore_client_abort off;
        proxy_intercept_errors    off;
        proxy_pass                http://127.0.0.1:3000;
        proxy_pass_header         Server;
        proxy_read_timeout        5m;
        proxy_redirect            off;
        proxy_send_timeout        5m;
        proxy_set_header          Host $host;
        proxy_set_header          X-Forwarded-For $http_x_forwarded_for;
        proxy_set_header          X-Real-IP $remote_addr;
        proxy_set_header          X-Forwarded-Proto $scheme;
    }
    
}
```
