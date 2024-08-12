import GObject from "gi://GObject";
import Gom from "gi://Gom";
import Gtk from "gi://Gtk";
import Adw from "gi://Adw";
import GLib from "gi://GLib";
import Gio from "gi://Gio";

const ItemClass = GObject.registerClass(
  {
    GTypeName: "Item",
    Properties: {
      id: GObject.ParamSpec.int(
        "id",
        "ID",
        "An ID",
        GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
        0,
        GLib.MAXINT32,
        0,
      ),
      url: GObject.ParamSpec.string(
        "url",
        "URL",
        "A URL",
        GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
        "",
      ),
    },
  },
  class ItemClass extends Gom.Resource { },
);

let adapter, repository;

function initDatabase() {
  adapter = new Gom.Adapter();
  adapter.open_sync(":memory:",);
  repository = new Gom.Repository({ adapter: adapter });

  // Set up table and primary key
  ItemClass.set_table("items");
  ItemClass.set_primary_key("id");

  // Perform automatic migration
  repository.automatic_migrate_sync(1, [ItemClass]);
}

function closeDatabase() {
  if (adapter) {
    adapter.close_sync();
  }
}

function showToast(overlay, message) {
  const toast = new Adw.Toast({
    title: message,
    timeout: 2,
  });
  overlay.add_toast(toast);
}

initDatabase();

const text_entry = workbench.builder.get_object("text_entry");
const id_entry = workbench.builder.get_object("id_entry");
const insert_button = workbench.builder.get_object("insert_button");
const search_entry = workbench.builder.get_object("search_entry");
const result_label = workbench.builder.get_object("result_label");
const overlay = workbench.builder.get_object("overlay");
const data_model = new Gio.ListStore({ item_type: ItemClass });
const column_view = workbench.builder.get_object("column_view");
const col1 = workbench.builder.get_object("col1");
const col2 = workbench.builder.get_object("col2");
var count = 0;

insert_button.connect("clicked", () => {
  const url = text_entry.text;
  const item = new ItemClass({ repository: repository, url: url });
  const success = item.save_sync();

  if (success) {
    showToast(overlay, "Item inserted successfully");
    data_model.append(item);
    id_entry.set_range(1, ++count);
  } else {
    showToast(overlay, "Failed to insert item");
  }
});

id_entry.connect("value-changed", () => {
  data_model.remove_all();
  const id = parseInt(id_entry.text);
  const filter = Gom.Filter.new_eq(ItemClass, "id", id);
  const found_item = repository.find_one_sync(ItemClass, filter);
  if (found_item) {
    data_model.append(found_item);
  } else {
    result_label.label = "Item not found";
  }
});

search_entry.connect("search-changed", () => {
  data_model.remove_all();
  const filter_text = search_entry.text.trim();
  if (filter_text === "") {
    result_label.label = "";
    return;
  }
  // Create a filter for Text matching
  const filter = Gom.Filter.new_glob(ItemClass, "url", `*${filter_text}*`);
  const filtered_items = repository.find_sync(ItemClass, filter);

  if (filtered_items && filtered_items.get_count() > 0) {
    filtered_items.fetch_async(0, filtered_items.get_count(), () => {
      for (let i = 0; i < filtered_items.get_count(); i++) {
        const item = filtered_items.get_index(i);
        if (item) data_model.append(item);
      }
      result_label.label = "Loaded successfully";
    });
  } else {
    result_label.label = "No matching items found";
  }
});

const factory_col1 = col1.factory;

factory_col1.connect("setup", (_self, list_item) => {
  const label = new Gtk.Label({
    margin_start: 12,
    margin_end: 12,
  });
  list_item.set_child(label);
});

factory_col1.connect("bind", (_self, list_item) => {
  const label_widget = list_item.get_child();
  const model_item = list_item.get_item();
  label_widget.label = model_item.url;
});

const factory_col2 = col2.factory;
factory_col2.connect("setup", (_self, list_item) => {
  const label = new Gtk.Label({
    margin_start: 12,
    margin_end: 12,
  });
  list_item.set_child(label);
});

factory_col2.connect("bind", (_self, list_item) => {
  const label_widget = list_item.get_child();
  const model_item = list_item.get_item();
  label_widget.label = model_item.id.toString();
});

column_view.model = new Gtk.SingleSelection({
  model: data_model,
});