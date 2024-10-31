import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

Gio._promisify(Gtk.FileLauncher.prototype, "launch", "launch_finish");
Gio._promisify(
  Gtk.FileLauncher.prototype,
  "open_containing_folder",
  "open_containing_folder_finish",
);
Gio._promisify(Gtk.FileDialog.prototype, "open", "open_finish");
Gio._promisify(Gtk.UriLauncher.prototype, "launch", "launch_finish");

const launch_file = workbench.builder.get_object<Gtk.Button>("launch_file");
const file_name = workbench.builder.get_object<Gtk.Label>("file_name");
const file_location = workbench.builder.get_object<Gtk.Button>("file_location");
const change_file = workbench.builder.get_object<Gtk.Button>("change_file");
const uri_launch = workbench.builder.get_object<Gtk.Button>("uri_launch");
const uri_details = workbench.builder.get_object<Gtk.Entry>("uri_details");

//File Launcher

const file = Gio.File.new_for_uri(workbench.resolve("workbench.txt"));
const file_launcher = new Gtk.FileLauncher({
  always_ask: true,
  file,
});

launch_file.connect("clicked", () => {
  // @ts-expect-error undetected async function
  file_launcher.launch(workbench.window, null).catch(console.error);
});

file_launcher.connect("notify::file", () => {
  const details = file_launcher.file.query_info(
    "standard::display-name",
    Gio.FileQueryInfoFlags.NONE,
    null,
  );
  file_name.label = details.get_display_name();
});

file_location.connect("clicked", () => {
  file_launcher
    .open_containing_folder(workbench.window, null)
    // @ts-expect-error undetected async function
    .catch(console.error);
});

change_file.connect("clicked", () => {
  new Gtk.FileDialog()
    .open(workbench.window, null)
    // @ts-expect-error undetected async function
    .then((file) => {
      file_launcher.file = file;
    })
    .catch(console.error);
});

// URI Launcher

uri_launch.connect("clicked", () => {
  new Gtk.UriLauncher({ uri: uri_details.text })
    .launch(workbench.window, null)
    // @ts-expect-error undetected async function
    .catch(console.error);
});
uri_details.connect("changed", () => {
  const text = uri_details.text;

  try {
    uri_launch.sensitive = GLib.Uri.is_valid(text, GLib.UriFlags.NONE);
  } catch {
    uri_launch.sensitive = false;
  }
});
