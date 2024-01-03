import gi

gi.require_version("Gtk", "4.0")

from gi.repository import GObject, Gdk, Gio, Gtk
import workbench


def createBoxWidget():
    return Gtk.Box(
        orientation=Gtk.Orientation.VERTICAL,
        halign=Gtk.Align.CENTER,
        valign=Gtk.Align.CENTER,
        spacing=6,
        margin_top=12,
        margin_bottom=12,
        margin_start=12,
        margin_end=12,
    )


def createVideoPreview(file):
    widget = createBoxWidget()
    video = Gtk.Video(file=file)
    widget.append(video)
    return widget


def createTextPreview(text):
    widget = createBoxWidget()

    label = Gtk.Label(label=text, wrap=True)
    widget.append(label)
    return widget


def createImagePreview(value):
    widget = createBoxWidget()

    picture = Gtk.Picture.new_for_file(value)
    picture.can_shrink = True
    picture.content_fit = Gtk.ContentFit.SCALE_DOWN
    widget.append(picture)
    return widget


def createFilePreview(file):
    widget = createBoxWidget()

    file_info = file.query_info("standard::icon", 0, None)
    icon = Gtk.Image.new_from_gicon(file_info.get_icon())
    widget.append(icon)
    icon.icon_size = Gtk.IconSize.LARGE

    file_name = Gtk.Label(label=file.get_basename())
    widget.append(file_name)

    return widget


def onDrop(value):
    if not isinstance(value, Gio.File):
        return False

    file_info = value.query_info("standard::content-type", 0, None)
    content_type = file_info.get_content_type()

    if content_type.startswith("image/"):
        return createImagePreview(value)
    elif content_type.startswith("video/"):
        return createVideoPreview(value)
    else:
        return createFilePreview(value)


def on_string_drop(_self, value, _x, _y):
    bin.set_child(createTextPreview(value))
    bin.remove_css_class("overlay-drag-area")


def on_file_drop(_self, value, _x, _y):
    try:
        bin.set_child(onDrop(value))
    except Exception as err:
        print(err, "Unable to load preview")
    bin.remove_css_class("overlay-drag-area")


def add_class(cl):
    bin.add_css_class(cl)
    return True


bin = workbench.builder.get_object("bin")

# Universal drop target for any String data
string_drop_target = Gtk.DropTarget.new(
    GObject.TYPE_STRING,
    Gdk.DragAction.COPY,
)

bin.add_controller(string_drop_target)

string_drop_target.connect("drop", on_string_drop)

# Drop Target for Files
file_drop_target = Gtk.DropTarget.new(Gio.File, Gdk.DragAction.COPY)
bin.add_controller(file_drop_target)
file_drop_target.connect("drop", on_file_drop)


# Drop Hover Effect

file_drop_target.connect("enter", lambda target, x, y: add_class("overlay-drag-area"))

file_drop_target.connect(
    "leave", lambda target: bin.remove_css_class("overlay-drag-area")
)

string_drop_target.connect("enter", lambda target, x, y: add_class("overlay-drag-area"))

string_drop_target.connect(
    "leave", lambda target: bin.remove_css_class("overlay-drag-area")
)
