# Church Media Client Web

Church media player client web application.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

## Environment Setup

Copy the example environment file and configure:
```bash
cp .env.example .env
```

Configure port in `.env`:
```
PORT=4000
```

## Server Connection

This client connects to a separate church media server via Socket.IO. 

The server component has been split into a separate repository: [church_media_server](https://github.com/0913vision/church_media_server)