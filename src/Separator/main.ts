import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const picture_one = workbench.builder.get_object<Gtk.Picture>("picture_one");
const picture_two = workbench.builder.get_object<Gtk.Picture>("picture_two");

const file = Gio.File.new_for_uri(workbench.resolve("./image.png"));

picture_one.file = file;
picture_two.file = file;
