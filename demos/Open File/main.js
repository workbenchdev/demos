import Gio from "gi://Gio";
import Gtk from "gi://Gtk";

Gio._promisify(Gtk.FileDialog.prototype, "open", "open_finish");
Gio._promisify(
  Gtk.FileDialog.prototype,
  "open_multiple",
  "open_multiple_finish",
);

const button_single = workbench.builder.get_object("button_single");
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

async function openMultipleFiles() {
  const filters = new Gio.ListStore();

  const textFilter = Gtk.FileFilter.new();
  textFilter.set_name("Text Files");
  textFilter.add_mime_type("text/*");
  filters.append(textFilter);

  const imageFilter = Gtk.FileFilter.new();
  imageFilter.set_name("Image Files");
  imageFilter.add_mime_type("image/*");
  filters.append(imageFilter);

  const audioFilter = Gtk.FileFilter.new();
  audioFilter.set_name("Audio Files");
  audioFilter.add_mime_type("audio/*");
  filters.append(audioFilter);

  const videoFilter = Gtk.FileFilter.new();
  videoFilter.set_name("Video Files");
  videoFilter.add_mime_type("video/*");
  filters.append(videoFilter);

  const pdfFilter = Gtk.FileFilter.new();
  pdfFilter.set_name("PDF Documents");
  pdfFilter.add_mime_type("application/pdf");
  filters.append(pdfFilter);

  const wordFilter = Gtk.FileFilter.new();
  wordFilter.set_name("Word Documents");
  wordFilter.add_mime_type("application/msword");
  filters.append(wordFilter);

  const zipFilter = Gtk.FileFilter.new();
  zipFilter.set_name("ZIP Archives");
  zipFilter.add_mime_type("application/zip");
  filters.append(zipFilter);

  const fileDialog = new Gtk.FileDialog({ filters });

  const files = await fileDialog.open_multiple(workbench.window, null);
  const selectedItemsCount = files.get_n_items();
  console.log(`No of selected files: ${selectedItemsCount}`);
}

button_single.connect("clicked", () => {
  openFile().catch(console.error);
});

button_multiple.connect("clicked", () => {
  openMultipleFiles().catch(console.error);
});
