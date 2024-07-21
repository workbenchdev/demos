# Python Development Support Files

This directory contains support files for developing Python demos:

- `requirements.txt`:
  Requirements for development. Contains dependency for `ruff` (linter & formatter), `mypy` (type checker)
  and `workbench-typestubs` (typestubs for the `workbench` module). All of these are also installed
  in the `re.sonny.Workbench.Devel` Flatpak (TODO: not true yet, see below.)
- `mypy.ini`:
  Rules for `mypy` used for all demos.
- `workbench-typestubs`:
  Python package containing typestubs for the `workbench` package which is available to demos and
  implements the Workbench API.

## Run type checks.

```sh
cd python-aux
pip3 install -r requirements.txt
cd ..
# Check single file:
mypy --config-file python-aux/mypy.ini src/Welcome/main.py
# Check all:
mypy --config-file python-aux/mypy.ini src
```

## TODO

TODO: All requirements should be in the Devel Flatpak, but unsure how the
typestub itself could be added there...? We might need to put that in an extra repo and add it
as a module to the Devel Flatpak. Ruff is already in there.
