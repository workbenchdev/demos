import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const path = Gio.File.new_for_uri(
  workbench.resolve("workbench.png"),
).get_path();

workbench.builder.get_object<Gtk.Image>("icon1").file = path;
workbench.builder.get_object<Gtk.Image>("icon2").file = path;
workbench.builder.get_object<Gtk.Image>("icon3").file = path;
