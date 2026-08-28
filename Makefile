# OmniCommerce Enterprise Makefile

.PHONY: all build start test clean

all: build test

build:
	npm run build

start:
	npm start

test:
	npm test

clean:
	rm -rf data/*.json
