import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const button_slide = workbench.builder.get_object<Gtk.ToggleButton>(
  "button_slide",
);
const button_crossfade = workbench.builder.get_object<Gtk.ToggleButton>(
  "button_crossfade",
);
const revealer_slide = workbench.builder.get_object<Gtk.Revealer>(
  "revealer_slide",
);
const revealer_crossfade = workbench.builder.get_object<Gtk.Revealer>(
  "revealer_crossfade",
);
const image1 = workbench.builder.get_object<Gtk.Picture>("image1");
const image2 = workbench.builder.get_object<Gtk.Picture>("image2");

image1.file = Gio.File.new_for_uri(workbench.resolve("./image1.png"));
image2.file = Gio.File.new_for_uri(workbench.resolve("./image2.png"));

button_slide.connect("toggled", () => {
  revealer_slide.reveal_child = button_slide.active;
});

button_crossfade.connect("toggled", () => {
  revealer_crossfade.reveal_child = button_crossfade.active;
});

revealer_slide.connect("notify::child-revealed", () => {
  if (revealer_slide.child_revealed) {
    console.log("Slide Revealer Shown");
  } else {
    console.log("Slide Revealer Hidden");
  }
});
