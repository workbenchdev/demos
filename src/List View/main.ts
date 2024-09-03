import Gtk from "gi://Gtk?version=4.0";

const list_view = workbench.builder.get_object<Gtk.ListView>("list_view");
const add = workbench.builder.get_object<Gtk.Button>("add");
const remove = workbench.builder.get_object<Gtk.Button>("remove");

//Model
let item = 1;
const string_model = new Gtk.StringList({
  strings: ["Default Item 1", "Default Item 2", "Default Item 3"],
});

const model = new Gtk.SingleSelection({ model: string_model });

//View
model.model.connect("items-changed", (_list, position, removed, added) => {
  console.log(
    `position: ${position}, Item removed? ${Boolean(
      removed,
    )}, Item added? ${Boolean(added)}`,
  );
});

model.connect("selection-changed", () => {
  const selected_item = model.get_selected();
  console.log(
    `Model item selected from view: ${string_model.get_string(selected_item)}`,
  );
});

list_view.model = model;

// Controller
add.connect("clicked", () => {
  const new_item = `New item ${item}`;
  string_model.append(new_item);
  item++;
});

remove.connect("clicked", () => {
  const selected_item = model.get_selected();
  string_model.remove(selected_item);
});
