// PLANTED ISSUE 3: hardcoded credential in source. Fake value, real
// shape (matches a typical Postgres connection string with an embedded
// password).
export const DB_URL =
  'postgres://admin:Sup3rSecret!2024@db.internal.example.com:5432/prod'
