NPM_BIN=./node_modules/.bin

default: test
all: default rebuild doc

test: test.lint test.format test.unit
test.lint:
	$(NPM_BIN)/eslint 'src/**/*.{ts,js}'
test.format:
	$(NPM_BIN)/prettier --list-different 'src/**/*.{ts,js}'
test.unit:
	$(NPM_BIN)/jest

fix: fix.lint fix.format
fix.lint:
	$(NPM_BIN)/eslint --fix 'src/**/*.{ts,js}'
fix.format:
	$(NPM_BIN)/prettier --write 'src/**/*.{ts,js}'

.PHONY: doc
doc: doc/index.html
doc/index.html: $(wildcard src/**)
	$(NPM_BIN)/typedoc

rebuild: clean build
clean:
	rm -rf lib/
build: lib/esm/core.js lib/cjs/core.js
lib/esm/core.js: tsconfig.json pnpm-lock.yaml $(wildcard src/**)
	$(NPM_BIN)/tsc -p $<
lib/cjs/core.js: tsconfig.cjs.json tsconfig.json pnpm-lock.yaml $(wildcard src/**)
	$(NPM_BIN)/tsc -p $<
