import gi

gi.require_version("Gtk", "4.0")
import workbench


def on_closed(popover):
    name = popover.get_name()
    print(f"{name} closed.")


popover_ids = ("plain_popover", "popover_menu")

for id in popover_ids:
    popover = workbench.builder.get_object(id)
    popover.connect("closed", on_closed)
