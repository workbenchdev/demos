import Gtk from "gi://Gtk?version=4.0";

const action_bar = workbench.builder.get_object<Gtk.ActionBar>("action_bar");
const button = workbench.builder.get_object<Gtk.ToggleButton>("button");
const start_widget = workbench.builder.get_object("start_widget");
const end_widget = workbench.builder.get_object("end_widget");

button.connect("notify::active", () => {
  action_bar.revealed = !button.active;
});

start_widget.connect("clicked", () => {
  console.log("Start widget");
});

end_widget.connect("clicked", () => {
  console.log("End widget");
});
