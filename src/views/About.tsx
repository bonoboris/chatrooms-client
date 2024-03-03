export default function About() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center space-y-4 p-8">
      <h1>About</h1>
      <section className="w-full">
        <h2>Chatrooms</h2>
        <p>Chatrooms is a demo project of an instant messaging web application.</p>
        <p>
          The goal of the project is develop and deploy a 'discord-like' web application with a
          minimum set of working features.
        </p>
        <p>It features:</p>
        <ul className="list-inside list-disc">
          <li>Authentication and User accounts</li>
          <li>Instant Messaging via Websocets</li>
          <li>Persistent messages</li>
          <li>Rooms</li>
        </ul>

        <h2>Backend</h2>
        <p>The backend is built in Python with FastAPI on top of a PostgreSQL database.</p>
        <p>The complete list of direct, runtime dependencies is:</p>
        <ul className="list-inside list-disc">
          <li>
            <code>FastAPI</code> (with pydantic) as the web framework
          </li>
          <li>
            <code>passlib</code> (with bycrypt) for cryptographic algorithm
          </li>
          <li>
            <code>psycopg</code> as the async PostgreSQL driver
          </li>
          <li>
            <code>pyton-jose</code> to generate and verify JWT tokens
          </li>
        </ul>

        <h3>Structure</h3>
        <p>
          The webserver is organized as an installable python package with the following layout:
        </p>
        <pre>
          src/ <br />
          &ensp;chatrooms/ <br />
          &ensp;&ensp;routers/ <br />
          &ensp;&ensp;database/ <br />
          &ensp;&ensp;__init__.py <br />
          &ensp;&ensp;app.py <br />
          tests/ <br />
          &ensp;test_chatrooms/ <br />
          pyproject.toml <br />
        </pre>

        <p>Dependencies are managed with PDM.</p>
        <p>Pytest & coverage are used for tests.</p>
        <p>Ruff & pyright / pylance is used for code quality.</p>

        <h3>Async webserver</h3>
        <p>Using FastAPI and psycopg 3, the webserver is allowed to run fully asynchronously.</p>
        <p>All IO operations are non blocking.</p>

        <h3>Authentication</h3>
        <p>Authentication is achieved OAuth2 password flow and JWT tokens.</p>
        <p>
          By providing the right username / password, the client is given a JWT access token, that
          grants access to the protocted routes (most of them).
        </p>
        <p>
          The access token is signed with a secret key, and it's validity is checked on every
          request.
        </p>

        <h3>Database</h3>
        <p>
          No 3rd party ORM nor query builder is used in this project, instead a small abstraction
          layer is built on top of psycopg to interact with the databse.
        </p>
        <p></p>
      </section>
    </main>
  );
}
