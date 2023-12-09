SHELL:=/bin/bash -O globstar
.PHONY: setup lint test ci
.DEFAULT_GOAL := ci

setup:
	flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
	flatpak install --or-update --user --noninteractive flathub org.gnome.Sdk//45 org.freedesktop.Sdk.Extension.rust-stable//23.08
	npm install
	flatpak-builder --ccache --force-clean flatpak build-aux/re.sonny.Workbench.Demos.json

lint:
# JavaScript
# ./node_modules/.bin/eslint --max-warnings=0 src
	./build-aux/fun biome ci demos/
# rustfmt
	./build-aux/fun rustfmt --check --edition 2021 demos/**/*.rs
# black
	./build-aux/fun black --check demos/**/*.py
# Blueprint
	find demos/ -type f -name "*blp" -print0 | xargs -0 ./build-aux/fun blueprint-compiler format

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
