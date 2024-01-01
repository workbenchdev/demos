SHELL:=/bin/bash -O globstar
.PHONY: setup lint test ci
.DEFAULT_GOAL := ci

setup:
	cd Workbench && make setup

lint:
# JavaScript
	./Workbench/build-aux/fun workbench-cli ci javascript demos/**/*.js
# Vala
# ./Workbench/build-aux/fun workbench-cli ci vala demos/**/*.vala
# Blueprint
# ./Workbench/build-aux/fun workbench-cli ci blueprint demos/**/*.blp
# CSS
# ./Workbench/build-aux/fun workbench-cli ci css demos/**/*.css
# Rust
	./Workbench/build-aux/fun rustfmt --check --edition 2021 demos/**/*.rs
# Python
	./Workbench/build-aux/fun black --check demos/**/*.py

format:
# npx prettier --write demos/**/*.json
	./Workbench/build-aux/fun workbench-cli format javascript demos/**/*.js
	./Workbench/build-aux/fun workbench-cli format css demos/**/*.css
	./Workbench/build-aux/fun black demos/**/*.py
	./Workbench/build-aux/fun rustfmt --edition 2021 demos/**/*.rs
	./Workbench/build-aux/fun workbench-cli format blueprint demos/**/*.blp
	./Workbench/build-aux/fun workbench-cli format vala demos/**/*.vala

test: lint

ci: setup test

# Sync with .gitignore
clean:
	rm -f demos/**/settings
	rm -f demos/**/workbench.vala
	rm -f demos/**/main.ui
	rm -f demos/**/libworkbenchcode.so
	rm -rf demos/**/__pycache__
