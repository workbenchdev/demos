import Gtk from "gi://Gtk?version=4.0";

const radio_button_1 = workbench.builder.get_object<Gtk.ToggleButton>(
  "radio_button_1",
);
const radio_button_2 = workbench.builder.get_object<Gtk.ToggleButton>(
  "radio_button_2",
);

radio_button_1.connect("toggled", () => {
  if (radio_button_1.active) console.log("Force Light Mode");
});

radio_button_2.connect("toggled", () => {
  if (radio_button_2.active) console.log("Force Dark Mode");
});
