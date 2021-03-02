# The default value of .SHELLFLAGS is -c normally, or -ec in POSIX-conforming mode.
# -e exit if any individual command fails
# -c interpret first argument as "command" (`bash -c ls` vs. `bash ls`)
.SHELLFLAGS = -ec
.SHELL = /bin/bash
# https://www.gnu.org/software/make/manual/html_node/One-Shell.html
# > ONESHELL: "all the lines in [a] recipe [will] be passed to a single invocation of the shell"
.ONESHELL:

node_modules: package.json yarn.lock
	yarn --pure-lockfile
