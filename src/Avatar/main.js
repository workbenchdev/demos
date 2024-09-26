import Gdk from "gi://Gdk?version=4.0";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

Gio._promisify(Gtk.FileDialog.prototype, "open", "open_finish");

const avatar_image = workbench.builder.get_object("avatar_image");
const button = workbench.builder.get_object("button");

const file_filter = new Gtk.FileFilter();
file_filter.add_pixbuf_formats();

const file_dialog = new Gtk.FileDialog({
  title: "Select an Avatar",
  modal: true,
  default_filter: file_filter,
});

button.connect("clicked", () => {
  onClicked().catch(console.error);
});

async function onClicked() {
  const file = await file_dialog.open(workbench.window, null);
  const texture = Gdk.Texture.new_from_file(file);
  avatar_image.set_custom_image(texture);
}
