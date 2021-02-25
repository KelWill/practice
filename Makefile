# The default value of .SHELLFLAGS is -c normally, or -ec in POSIX-conforming mode.
# -e exit if any individual command fails
# -c interpret first argument as "command" (`bash -c ls` vs. `bash ls`)
.SHELLFLAGS = -ec
.SHELL = /bin/bash
# https://www.gnu.org/software/make/manual/html_node/One-Shell.html
# > ONESHELL: "all the lines in [a] recipe [will] be passed to a single invocation of the shell"
.ONESHELL:

watch: node_modules run
	@fswatch ./katas/** | xargs -n 1 ./scripts/run-kata-for-file.sh

run:
	@ls ./katas/** | xargs -n 1 ./scripts/run-kata-for-file.sh

node_modules: package.json yarn.lock
	yarn --pure-lockfile

lint-fix:
	./node_modules/.bin/prettier --write ./katas
	./node_modules/.bin/eslint --fix --ext .ts

