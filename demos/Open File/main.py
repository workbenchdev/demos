import gi

gi.require_version("Gtk", "4.0")
from gi.repository import Gtk, Gio, GLib
import workbench

button_single = workbench.builder.get_object("button_single")
button_image = workbench.builder.get_object("button_image")
button_multiple = workbench.builder.get_object("button_multiple")

image_filter = Gtk.FileFilter(name="Images")
image_filter.add_mime_type("image/*")
file_dialog = Gtk.FileDialog(
    default_filter=image_filter,
)


def on_file_opened(dialog, result):
    file = dialog.open_finish(result)
    info = file.query_info(
        "standard::name",
        Gio.FileQueryInfoFlags.NONE,
        None,
    )
    print(f"Selected File: {info.get_name()}")


def open_file():
    dialog_for_file = Gtk.FileDialog()
    dialog_for_file.open(workbench.window, None, on_file_opened)


def on_image_opened(dialog, result):
    file = file_dialog.open_finish(result)
    info = file.query_info("standard::name", Gio.FileQueryInfoFlags.NONE, None)

    print(f"Selected File: {info.get_name()}")


def open_image():
    dialog_for_image = file_dialog
    dialog_for_image.open(workbench.window, None, on_image_opened)


def on_multiple_files_opened(dialog, result):
    files = dialog.open_multiple_finish(result)
    selected_items_count = files.get_n_items()
    print(f"No of selected files: {selected_items_count}")


def open_multiple_files():
    dialog_for_multiple_files = Gtk.FileDialog()
    dialog_for_multiple_files.open_multiple(
        workbench.window, None, on_multiple_files_opened
    )


button_single.connect("clicked", lambda *_: open_file())
button_image.connect("clicked", lambda *_: open_image())
button_multiple.connect("clicked", lambda *_: open_multiple_files())
