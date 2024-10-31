import Adw from "gi://Adw";
import GLib from "gi://GLib";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

Gio._promisify(Gtk.FileLauncher.prototype, "launch", "launch_finish");

const edit_entry = workbench.builder.get_object<Gtk.TextView>("edit_entry");
const view_file = workbench.builder.get_object<Gtk.Button>("view_file");
const delete_file = workbench.builder.get_object<Gtk.Button>("delete_file");
const edit_file = workbench.builder.get_object<Gtk.Button>("edit_file");
const file_name = workbench.builder.get_object<Gtk.Label>("file_name");
const { buffer } = edit_entry;
const file = Gio.File.new_for_uri(workbench.resolve("workbench.txt"));
const file_dir = file.get_parent();
const overlay = workbench.builder.get_object<Adw.ToastOverlay>("overlay");
const file_launcher = new Gtk.FileLauncher({
  always_ask: true,
  file,
});
const details = file.query_info(
  "standard::display-name",
  Gio.FileQueryInfoFlags.NONE,
  null,
);
file_name.label = details.get_display_name();
buffer.text = "Start editing ... ";

const monitor_for_dir = file_dir.monitor(
  Gio.FileMonitorFlags.WATCH_MOVES,
  null,
);
const monitor_for_file = file.monitor(Gio.FileMonitorFlags.NONE, null);

delete_file.connect("clicked", () => {
  // @ts-expect-error undetected async function
  file.delete_async(GLib.PRIORITY_DEFAULT, null).catch(console.error);
});

view_file.connect("clicked", () => {
  // @ts-expect-error undetected async function
  file_launcher.launch(workbench.window, null).catch(console.error);
});

monitor_for_file.connect("changed", (_self, _file, _other_file, event) => {
  if (event === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
    const toast = new Adw.Toast({
      title: "File modified",
      timeout: 2,
    });
    overlay.add_toast(toast);
  }
});

monitor_for_dir.connect("changed", (_self, child, other_file, event) => {
  const toast = new Adw.Toast({
    timeout: 2,
  });

  switch (event) {
    case Gio.FileMonitorEvent.RENAMED:
      toast.title =
        `${child.get_basename()} was renamed to ${other_file.get_basename()}`;
      break;
    case Gio.FileMonitorEvent.DELETED:
      toast.title = `${child.get_basename()} was deleted from the directory`;
      break;
    case Gio.FileMonitorEvent.CREATED:
      toast.title = `${child.get_basename()} created in the directory`;
      break;
  }

  if (toast.title) overlay.add_toast(toast);
});

edit_file.connect("clicked", () => {
  file
    .replace_contents_async(
      buffer.text,
      null,
      false,
      Gio.FileCreateFlags.REPLACE_DESTINATION,
      null,
    )
    // @ts-expect-error undetected async function
    .catch(console.error);
});
