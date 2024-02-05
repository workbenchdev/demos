SHELL:=/bin/bash -O globstar
.PHONY: setup lint test ci
.DEFAULT_GOAL := ci

setup:
	flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
	flatpak install --or-update --user --noninteractive flathub re.sonny.Workbench org.freedesktop.Sdk.Extension.rust-stable//23.08 org.freedesktop.Sdk.Extension.vala//23.08

lint:
# Rust
	flatpak run --command="/usr/lib/sdk/rust-stable/bin/rustfmt" --filesystem=host re.sonny.Workbench --check --edition 2021 demos/**/*.rs
# Python
	flatpak run --command="black" --filesystem=host re.sonny.Workbench --check demos/**/*.py

format:
# npx prettier --write demos/**/*.json
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format javascript demos/**/*.js
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format css demos/**/*.css
	flatpak run --command="black" --filesystem=host re.sonny.Workbench demos/**/*.py
	flatpak run --command="/usr/lib/sdk/rust-stable/bin/rustfmt" --filesystem=host re.sonny.Workbench --edition 2021 demos/**/*.rs
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format blueprint demos/**/*.blp
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format vala demos/**/*.vala

test: lint
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench ci demos/*

ci: setup test

# Sync with .gitignore
clean:
	rm -f demos/**/settings
	rm -f demos/**/workbench.vala
	rm -f demos/**/main.ui
	rm -f demos/**/libworkbenchcode.so
	rm -rf demos/**/__pycache__
	rm -rf demos/**/Cargo.toml
	rm -rf demos/**/Cargo.lockfile
	rm -rf demos/**/lib.rs
	rm -rf demos/**/workbench.rs
