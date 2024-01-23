import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

Gio._promisify(Gtk.FileDialog.prototype, "open", "open_finish");
Gio._promisify(
  Gtk.FileDialog.prototype,
  "open_multiple",
  "open_multiple_finish",
);

const button_single = workbench.builder.get_object("button_single");
const button_image = workbench.builder.get_object("button_image");
const button_multiple = workbench.builder.get_object("button_multiple");

async function openFile() {
  const dialog_for_file = new Gtk.FileDialog();
  const file = await dialog_for_file.open(workbench.window, null);
  const info = file.query_info(
    "standard::name",
    Gio.FileQueryInfoFlags.NONE,
    null,
  );
  console.log(`Selected File: ${info.get_name()}`);
}

async function openImageFile() {
  const filters = new Gio.ListStore();

  const imageFilter = Gtk.FileFilter.new();
  imageFilter.set_name("Image File");
  imageFilter.add_mime_type("image/*");
  filters.append(imageFilter);

  const fileDialog = new Gtk.FileDialog({ filters });
  const file = await fileDialog.open(workbench.window, null);
  const info = file.query_info(
    "standard::name",
    Gio.FileQueryInfoFlags.NONE,
    null,
  );
  console.log(`Selected file: ${info.get_name()}`);
}

async function openMultipleFiles() {
  const dialog_for_multiple_files = new Gtk.FileDialog();
  const files = await dialog_for_multiple_files.open_multiple(
    workbench.window,
    null,
  );
  const selected_items_count = files.get_n_items();
  console.log(`No of selected files: ${selected_items_count}`);
}

button_single.connect("clicked", () => {
  openFile().catch(console.error);
});

button_image.connect("clicked", () => {
  openImageFile().catch(console.error);
});

button_multiple.connect("clicked", () => {
  openMultipleFiles().catch(console.error);
});
