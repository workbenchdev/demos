import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const dialog = workbench.builder.get_object<Adw.Dialog>("dialog");
const button = workbench.builder.get_object<Gtk.Button>("button");
const image = workbench.builder.get_object<Gtk.Image>("image");

image.file = Gio.File.new_for_uri(workbench.resolve("image.svg")).get_path();

button.connect("clicked", () => {
  dialog.present(workbench.window);
});

dialog.connect("close-attempt", () => {
  console.log("Close Attempt");
  dialog.force_close();
});

dialog.connect("closed", () => {
  console.log("Closed");
});
