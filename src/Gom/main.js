import GObject from "gi://GObject";
import Gom from "gi://Gom";
import Gtk from "gi://Gtk";
import Adw from "gi://Adw";
import GLib from "gi://GLib";
import Gio from "gi://Gio";

const INT32_MAX = 2147483647;

const ItemClass = GObject.registerClass({
  GTypeName: 'Item',
  Properties: {
    'id': GObject.ParamSpec.int(
      'id', 'ID', 'An ID',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      0, INT32_MAX, 0
    ),
    'url': GObject.ParamSpec.string(
      'url', 'URL', 'A URL',
      GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
      ''
    ),
  },
}, class ItemClass extends Gom.Resource { });

let adapter, repository;

function initDatabase() {
  adapter = new Gom.Adapter();
  adapter.open_sync(':memory:',);
  repository = new Gom.Repository({ adapter: adapter });

  ItemClass.set_table('items');
  ItemClass.set_primary_key('id');

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

const url_entry = workbench.builder.get_object("url_entry");
const id_entry = workbench.builder.get_object("id_entry");
const insert_button = workbench.builder.get_object("insert_button");
const find_button = workbench.builder.get_object("find_button");
const filter_entry = workbench.builder.get_object("filter_entry");
const filter_button = workbench.builder.get_object("filter_button");
const result_label = workbench.builder.get_object("result_label");
const overlay = workbench.builder.get_object("overlay");

const data_model = new Gio.ListStore({ item_type: ItemClass });
const column_view = workbench.builder.get_object("column_view");
const col1 = workbench.builder.get_object("col1");
const col2 = workbench.builder.get_object("col2");

insert_button.connect("clicked", () => {
  const url = url_entry.text;
  const item = new ItemClass({ repository: repository, url: url });
  const success = item.save_sync();
  if (success) {
    showToast(overlay, "Item inserted successfully");
    data_model.append(item);
  } else {
    result_label.label = "Failed to insert item";
    showToast(overlay, "Failed to insert item");
  }
});

find_button.connect("clicked", () => {
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

filter_button.connect("clicked", () => {
  data_model.remove_all();
  const filter_text = filter_entry.text.trim();
  if (filter_text === "") {
    result_label.label = "Enter a value";
    return;
  }

  const filter = Gom.Filter.new_glob(ItemClass, 'url', `*${filter_text}*`);
  const filtered_items = repository.find_sync(ItemClass, filter);

  if (filtered_items) {
    const count = filtered_items.get_count();
    if (count > 0) {
      filtered_items.fetch_async(0, count, () => {
        for (let i = 0; i < count; i++) {
          const item = filtered_items.get_index(i);
          if (item) {
            data_model.append(item);
          }
        }
        result_label.label = "Loaded successfully";
      });
    } else {
      result_label.label = "No matching items found";
    }
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