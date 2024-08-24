import Gtk from "gi://Gtk?version=4.0";

const button = workbench.builder.get_object<Gtk.Button>("button");
const spinner = workbench.builder.get_object<Gtk.Spinner>("spinner");

button.connect("clicked", () => {
  if (spinner.spinning === true) {
    button.icon_name = "media-playback-start";
    spinner.spinning = false;
  } else {
    button.icon_name = "media-playback-pause";
    spinner.spinning = true;
  }
});
