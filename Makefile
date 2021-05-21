NPM_BIN=./node_modules/.bin

default: lint test
all: default build

lint:
	$(NPM_BIN)/eslint 'src/**/*.{ts,js}'

test:
	$(NPM_BIN)/jest

prettify:
	$(NPM_BIN)/prettier --write --config prettier.config.js 'src/**/*.{ts,js}'

build: lib/esm/core.js lib/cjs/core.js

lib/esm/core.js: tsconfig.json pnpm-lock.yaml $(wildcard src/**)
	$(NPM_BIN)/tsc -p $<

lib/cjs/core.js: tsconfig.cjs.json tsconfig.json pnpm-lock.yaml $(wildcard src/**)
	$(NPM_BIN)/tsc -p $<
