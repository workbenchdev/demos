import gi

gi.require_version("Gtk", "4.0")
from gi.repository import Gtk, Gio, GLib
import workbench

button_single = workbench.builder.get_object("button_single")
button_image = workbench.builder.get_object("button_image")
button_multiple = workbench.builder.get_object("button_multiple")
file_filter_image = workbench.builder.get_object("file_filter_image")


def on_file_opened(dialog, result):
    file = dialog.open_finish(result)
    print(f"Selected File: {get_file_name(file)}")


def open_file():
    dialog = Gtk.FileDialog()
    dialog.open(workbench.window, None, on_file_opened)


def on_image_opened(dialog, result):
    file = dialog.open_finish(result)
    print(f"Selected Image: {get_file_name(file)}")


def open_image():
    dialog = Gtk.FileDialog(default_filter=file_filter_image)
    dialog.open(workbench.window, None, on_image_opened)


def on_multiple_files_opened(dialog, result):
    print(f"Selected Files:")
    files = dialog.open_multiple_finish(result)
    for file in files:
        print(f"  {get_file_name(file)}")


def open_multiple_files():
    dialog = Gtk.FileDialog()
    dialog.open_multiple(workbench.window, None, on_multiple_files_opened)


def get_file_name(file):
    info = file.query_info("standard::name", Gio.FileQueryInfoFlags.NONE, None)
    return info.get_name()


button_single.connect("clicked", lambda *_: open_file())
button_image.connect("clicked", lambda *_: open_image())
button_multiple.connect("clicked", lambda *_: open_multiple_files())

