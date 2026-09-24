# Architecture

The generated project is a pnpm workspace with independent web, API and worker applications. Shared contracts contain no UI dependencies. Persistence is hidden behind repositories so local SQLite can later be replaced by PostgreSQL.

