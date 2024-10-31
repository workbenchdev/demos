import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

Gio._promisify(
  Gtk.FileDialog.prototype,
  "select_folder",
  "select_folder_finish",
);
Gio._promisify(
  Gtk.FileDialog.prototype,
  "select_multiple_folders",
  "select_multiple_folders_finish",
);

const button_single = workbench.builder.get_object("button_single");
const button_multiple = workbench.builder.get_object("button_multiple");

async function selectFolder() {
  const dialog_for_folder = new Gtk.FileDialog();
  // @ts-expect-error this function is not detected as async
  const file = await dialog_for_folder.select_folder(workbench.window, null) as
    | Gio.File
    | null;
  const info = file.query_info(
    "standard::name",
    Gio.FileQueryInfoFlags.NONE,
    null,
  );
  console.log(`"${info.get_name()}" selected`);
}

async function selectMultipleFolders() {
  const dialog = new Gtk.FileDialog();
  // @ts-expect-error this function is not detected as async
  const folders = await dialog.select_multiple_folders(
    workbench.window,
    null,
  ) as Gio.ListModel | null;
  const selected_items_count = folders.get_n_items();
  console.log(`${selected_items_count} selected folders`);
}

button_single.connect("clicked", () => {
  selectFolder().catch(console.error);
});

button_multiple.connect("clicked", () => {
  selectMultipleFolders().catch(console.error);
});
