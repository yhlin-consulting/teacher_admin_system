# teacher_admin_system
NodeJS API Assessment

## Commands

### Local Development

VS Code Extensions
If you are using VS Code, install the following from the marketplace, or add them to the `devcontainer.json` file.
- Prettier linting tool
- Microsoft Container Tool
- Docker Tool

For Docker Compose, add the `docker-in-docker` feature to the `features` section om `devcontainer.json` file.

`devcontainer.json`
```
{
	"name": "Node.js & TypeScript",guide/dockerfile
	"image": "mcr.microsoft.com/devcontainers/typescript-node:4-22-bookworm",
    //"build": {
    //    "dockerfile": "../admin_app/Dockerfile",
    //    "context": ".."
    //},
    "features": {
        "ghcr.io/devcontainers/features/docker-in-docker:2": {
            "version": "latest",
            "enableNonRootDocker": true,
            "moby": true
        }
    },
	"customizations": {
		"vscode": {
			"extensions": [
				"esbenp.prettier-vscode",
				"ms-azuretools.vscode-containers"
			]
		}
	}
}
```

Set up `.env` file in project root directory
```
MYSQL_DATABASE=mydb
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword
MYSQL_ROOT_PASSWORD=secretpassword
```

Use NestJS CLI to create a new NestJS project using `npx`
`npx @nestjs/cli new admin_app`

Add test modules
`npm install --save-dev @types/jest`

In `tsconfig.json` file, add this to compilerOptions
```
types: ["jest", "node"]
```

Check versions
`node --version`

To run project in local development 
`npm run start:dev`
Whenever a file changes, this change is detected and auto-restarts the server.


Using MySQL
Install NestJS TypeORM wrapper, base TypeORM library, and mysql2 driver
`npm install @nestjs/typeorm typeorm mysql2`

Using OpenAPI (Swagger) Documentation
`npm install --save @nestjs/swagger`

You can open localhost:3000/api to view the API documentation in OpenAPI (Swagger) format!

Request/Response validation
`npm install class-validator class-transformer`

Linting
If you are using VS Code, to format on save, add the prettier extension to your devcontainer or install the extension through the marketplace in VS Code. See VS Code section above.

Or, you can run `npm run format`.
Ensure that in your `package.json` file, in the `scripts` section, you can see the entry `format`.

Create a folder `.vscode`
In the folder, create the file `settings.json`.
In `settings.json` file, add the following:
```
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## `builder.sh` file
This file contains commands for you to run the project more easily.

If you encounter permission errors, run the following command:
`chmod +x builder.sh`

Run Tests
`npm run test` - Run all test (Good for production)
`npm run test:watch` - Run only the tests where code changes occur (Good for development)

Project Strucure
admin_app
|--.devcontainer/
    |-- devcontainer.json
|--.vscode/
    |-= settings.json
|



## Production
To run project in production
`npm run start`
This runs the pre-compiled code in `dist/` and results in a faster start-up process.