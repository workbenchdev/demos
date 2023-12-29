SHELL:=/bin/bash -O globstar
.PHONY: setup lint test ci
.DEFAULT_GOAL := ci

setup:
	cd Workbench && make build

lint:
# JavaScript
	./Workbench/build-aux/fun workbench-cli ci javascript demos/**/*.js
# Vala
	./Workbench/build-aux/fun workbench-cli ci vala demos/**/*.vala
# Blueprint
	./Workbench/build-aux/fun workbench-cli ci blueprint demos/**/*.blp
# CSS
	./Workbench/build-aux/fun workbench-cli ci css demos/**/*.css
# Rust
	./Workbench/build-aux/fun rustfmt --check --edition 2021 demos/**/*.rs
# Python
	./Workbench/build-aux/fun black --check demos/**/*.py

test: lint

ci: setup lint

# Sync with .gitignore
clean:
	rm -f demos/**/settings
	rm -f demos/**/workbench.vala
	rm -f demos/**/main.ui
	rm -f demos/**/libworkbenchcode.so
	rm -rf demos/**/__pycache__
	rm -rf _build
	rm -rf .flatpak
	rm -rf .flatpak-builder
	rm -rf flatpak
	rm -rf flatpak-builder
	rm -rf repo
