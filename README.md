This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

[Create Docker with hotreload NEXTJS](https://blog.devops.dev/using-next-js-13-app-directory-with-hot-reload-enabled-in-docker-simple-guide-60de42840d7e)

## Getting Started

First, run the development server:

```bash
# For Development:
docker-compose -f .\docker-compose.dev.yaml up

# For Production:
docker-compose -f .\docker-compose.prod.yaml up
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
