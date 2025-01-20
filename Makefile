CURRENT_UID := $(shell id -u):$(shell id -g)
NMP := docker run --user=${CURRENT_UID} -v $(PWD):/project -w /project --rm node:22 npm
NODE := docker run --user=${CURRENT_UID} -v $(PWD):/project -w /project -it --rm node:22

setup:
	${NMP} install

lint:
	${NMP} run lint

test:
	${NMP} test

bundle:
	${NMP} run bundle

run-local:
	${NMP} run local-action

shell:
	${NODE} bash