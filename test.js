const jwt = require('jsonwebtoken');
const config = require('config');
let token = !!~jwt.verify('2eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGVhbWlkIjoiNzY1NjExOTgwMTQ2NzYxODUiLCJjb21tdW5pdHl2aXNpYmlsaXR5c3RhdGUiOjMsInByb2ZpbGVzdGF0ZSI6MSwicGVyc29uYW5hbWUiOiLQn9CQ0JbQmNCb0J7QmSDQm9CV0JfQldCg0JzQldCdIiwicHJvZmlsZXVybCI6Imh0dHBzOi8vc3RlYW1jb21tdW5pdHkuY29tL2lkLzExNDc0MS8iLCJhdmF0YXIiOiJodHRwczovL3N0ZWFtY2RuLWEuYWthbWFpaGQubmV0L3N0ZWFtY29tbXVuaXR5L3B1YmxpYy9pbWFnZXMvYXZhdGFycy80Yi80YmI0ZTM2N2VlMGZmZWM1NTY4OWQ5NWU0N2QwNWMwMGM2ZTk4YjdlLmpwZyIsImF2YXRhcm1lZGl1bSI6Imh0dHBzOi8vc3RlYW1jZG4tYS5ha2FtYWloZC5uZXQvc3RlYW1jb21tdW5pdHkvcHVibGljL2ltYWdlcy9hdmF0YXJzLzRiLzRiYjRlMzY3ZWUwZmZlYzU1Njg5ZDk1ZTQ3ZDA1YzAwYzZlOThiN2VfbWVkaXVtLmpwZyIsImF2YXRhcmZ1bGwiOiJodHRwczovL3N0ZWFtY2RuLWEuYWthbWFpaGQubmV0L3N0ZWFtY29tbXVuaXR5L3B1YmxpYy9pbWFnZXMvYXZhdGFycy80Yi80YmI0ZTM2N2VlMGZmZWM1NTY4OWQ5NWU0N2QwNWMwMGM2ZTk4YjdlX2Z1bGwuanBnIiwibGFzdGxvZ29mZiI6MTU4MTQxODc3OCwicGVyc29uYXN0YXRlIjowLCJwcmltYXJ5Y2xhbmlkIjoiMTAzNTgyNzkxNDM0MDExMTA3IiwidGltZWNyZWF0ZWQiOjEyNTYxMDQyMjksInBlcnNvbmFzdGF0ZWZsYWdzIjowLCJsb2Njb3VudHJ5Y29kZSI6IkZSIiwiaWF0IjoxNTgxNDM4MjQ3fQ.IjY89FC9leBMgSk9gB9byx5YUVfnAP_LDbSJDilXSSI', config.authorization.secretKey);
console.log(token);