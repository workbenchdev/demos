SHELL:=/bin/bash -O globstar
.PHONY: setup lint test ci
.DEFAULT_GOAL := ci

setup:
	flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
	flatpak remote-add --user --if-not-exists flathub-beta https://flathub.org/beta-repo/flathub-beta.flatpakrepo
	flatpak install --or-update --user --noninteractive flathub-beta re.sonny.Workbench
	flatpak install --or-update --user --noninteractive flathub org.freedesktop.Sdk.Extension.rust-stable//23.08 org.freedesktop.Sdk.Extension.vala//23.08

lint:
# Rust
	flatpak run --command="/usr/lib/sdk/rust-stable/bin/rustfmt" --filesystem=host re.sonny.Workbench --check --edition 2021 demos/**/*.rs
# Python
	flatpak run --command="ruff" --filesystem=host re.sonny.Workbench check --config=../src/langs/python/ruff.toml demos/**/*.py

format:
# npx prettier --write demos/**/*.json
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format javascript demos/**/*.js
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format css demos/**/*.css
	flatpak run --command="ruff" --filesystem=host re.sonny.Workbench format --config=../src/langs/python/ruff.toml demos/**/*.py
	flatpak run --command="/usr/lib/sdk/rust-stable/bin/rustfmt" --filesystem=host re.sonny.Workbench --edition 2021 demos/**/*.rs
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format blueprint demos/**/*.blp
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format vala demos/**/*.vala

test: lint
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench ci demos/*

ci: setup test

# Sync with .gitignore
clean:
	rm -f demos/*/settings
	rm -f demos/*/workbench.vala
	rm -f demos/*/main.ui
	rm -f demos/*/libworkbenchcode.so
	rm -f demos/*/Cargo.toml
	rm -f demos/*/Cargo.lockfile
	rm -f demos/*/lib.rs
	rm -f demos/*/workbench.rs
	rm -rf demos/*/target
	rm -rf demos/*/__pycache__
