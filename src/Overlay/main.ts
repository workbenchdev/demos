import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const file = Gio.File.new_for_uri(workbench.resolve("./image.png"));

const picture = workbench.builder.get_object<Gtk.Picture>("picture");
picture.file = file;
