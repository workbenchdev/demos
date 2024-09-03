import Adw from "gi://Adw";
import Gtk from "gi://Gtk?version=4.0";

const circular_switch = workbench.builder.get_object<Adw.SwitchRow>(
  "circular_switch",
);
const secondary_button = workbench.builder.get_object<Gtk.MenuButton>(
  "secondary",
);

circular_switch.connect("notify::active", () => {
  if (circular_switch.active) {
    secondary_button.add_css_class("circular");
  } else {
    secondary_button.remove_css_class("circular");
  }
});
