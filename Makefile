NPM_BIN=./node_modules/.bin

default: lint test
all: default build

lint:
	$(NPM_BIN)/eslint 'src/**/*.{ts,js}'

test:
	$(NPM_BIN)/jest

prettify:
	$(NPM_BIN)/prettier --write --config prettier.config.js 'src/**/*.{ts,js}'

build: lib/core.js

lib/core.js: $(wildcard src/**) pnpm-lock.yaml
	$(NPM_BIN)/tsc -p .
