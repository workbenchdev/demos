SHELL:=/bin/bash -O globstar
.PHONY: setup test ci
.DEFAULT_GOAL := ci

setup:
	flatpak remote-add --user --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
# flatpak remote-add --user --if-not-exists flathub-beta https://flathub.org/beta-repo/flathub-beta.flatpakrepo
	flatpak install --or-update --user --noninteractive flathub re.sonny.Workbench org.freedesktop.Sdk.Extension.rust-stable//23.08 org.freedesktop.Sdk.Extension.vala//23.08

format:
# npx prettier --write src/*/*.json
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format javascript src/*/*.js
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format css src/*/*.css
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format python src/*/*.py
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format rust src/*/*.rs
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format blueprint src/*/*.blp
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench format vala src/*/*.vala

test:
# list folders that have changed and run workbench-cli ci on them
	git diff --dirstat=files,0 origin/main src | sed 's/^[ 0-9.]\+% //g' | uniq | xargs -d '\n' flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench ci

all:
	flatpak run --command="workbench-cli" --filesystem=host re.sonny.Workbench ci src/*

ci: setup test

# Sync with .gitignore
clean:
	rm -f src/*/settings
	rm -f src/*/workbench.vala
	rm -f src/*/main.ui
	rm -f src/*/libworkbenchcode.so
	rm -f src/*/Cargo.toml
	rm -f src/*/Cargo.lockfile
	rm -f src/*/lib.rs
	rm -f src/*/workbench.rs
	rm -rf src/*/target
	rm -rf src/*/__pycache__
