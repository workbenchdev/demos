import gi

gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Gtk, GObject, Gio
import workbench

list_view = workbench.builder.get_object("list_view")
item_factory = workbench.builder.get_object("item_factory")
header_factory = workbench.builder.get_object("header_factory")


class CustomModel(GObject.GObject, Gio.ListModel, Gtk.SectionModel):
    def __init__(self):
        super().__init__()
        self.internal_list = Gtk.StringList()

    def do_get_section(self, position):
        start = (position // 5) * 5
        end = start + 5
        print(position)
        return (start, end)

    def do_get_item(self, position):
        return self.internal_list[position]

    def do_get_n_items(self):
        return len(self.internal_list)

    def do_get_item_type(self):
        return GObject.Object

    def append(self, item):
        self.internal_list.append(item)


def on_setup_item(_, list_item):
    list_item.set_child(Gtk.Label(margin_start=12, xalign=0))


def on_bind_item(_, list_item):
    item = list_item.get_item()
    label = list_item.get_child()

    label.set_label(item.get_string())


def on_setup_header(_, list_item):
    list_item.set_child(Gtk.Label(label="Header", xalign=0))


custom_model = CustomModel()

for i in range(0, 200):
    custom_model.append(f"Item {i}")

item_factory.connect("setup", on_setup_item)
item_factory.connect("bind", on_bind_item)

header_factory.connect("setup", on_setup_header)

selection_model = Gtk.NoSelection(model=custom_model)

list_view.set_model(selection_model)
