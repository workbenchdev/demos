import Gtk from "gi://Gtk?version=4.0";

const button = workbench.builder.get_object<Gtk.Button>("button");
const spinner = workbench.builder.get_object<Gtk.Spinner>("spinner");

button.connect("clicked", () => {
  if (spinner.visible === true) {
    button.icon_name = "media-playback-start";
    spinner.visible = false;
  } else {
    button.icon_name = "media-playback-stop";
    spinner.visible = true;
  }
});
