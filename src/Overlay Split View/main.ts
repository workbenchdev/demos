import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";

const split_view = workbench.builder.get_object<Adw.OverlaySplitView>(
  "split_view",
);
const start_toggle = workbench.builder.get_object<Gtk.ToggleButton>("start_toggle");
const end_toggle = workbench.builder.get_object<Gtk.ToggleButton>("end_toggle");

start_toggle.connect("toggled", () => {
  split_view.sidebar_position = Gtk.PackType.START;
});

end_toggle.connect("toggled", () => {
  split_view.sidebar_position = Gtk.PackType.END;
});
