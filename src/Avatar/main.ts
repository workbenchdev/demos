import Adw from "gi://Adw";
import Gdk from "gi://Gdk?version=4.0";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

Gio._promisify(Gtk.FileDialog.prototype, "open", "open_finish");

const avatar_image = workbench.builder.get_object<Adw.Avatar>("avatar_image");
const button = workbench.builder.get_object<Gtk.Button>("button");

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
  // @ts-expect-error this function's type isn't detected as async yet
  const file = await file_dialog.open(workbench.window, null) as Gio.File;
  const texture = Gdk.Texture.new_from_file(file);
  avatar_image.set_custom_image(texture);
}
