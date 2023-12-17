SHELL:=/bin/bash -O globstar
.PHONY: setup lint test ci
.DEFAULT_GOAL := ci

setup:
	flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
	flatpak install --or-update --user --noninteractive flathub org.gnome.Sdk//45 org.freedesktop.Sdk.Extension.rust-stable//23.08 org.freedesktop.Sdk.Extension.vala//23.08
	npm install
	flatpak-builder --ccache --force-clean flatpak build-aux/re.sonny.Workbench.Demos.json

lint:
# JavaScript
	./build-aux/fun biome ci demos/
# Vala
	./build-aux/fun uncrustify -c - --check --set indent_with_tabs=0 --set nl_end_of_file=force --set nl_end_of_file_min=1 --set indent_columns=4 demos/**/*.vala
# Rust
	./build-aux/fun rustfmt --check --edition 2021 demos/**/*.rs
# Python
	./build-aux/fun black --check demos/**/*.py
# Blueprint
	./build-aux/fun blueprint-compiler format demos/**/*.blp

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
