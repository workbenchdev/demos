import Gtk from "gi://Gtk";
import GObject from "gi://GObject";
import Gio from "gi://Gio";

const list_view = workbench.builder.get_object<Gtk.ListView>("list_view");
const factory = workbench.builder.get_object<Gtk.SignalListItemFactory>("factory");

class TreeNode extends GObject.Object {
  constructor(public title: string, public children: TreeNode[]) {
    super();
  }

  static {
    GObject.registerClass(this);
  }
}

class TreeWidget extends Gtk.Box {
  expander = new Gtk.TreeExpander();
  label = new Gtk.Label({ halign: Gtk.Align.START });

  constructor(args?: Partial<Gtk.Box.ConstructorProps>) {
    super(args);
    this.spacing = 6;
    this.margin_start = 6;
    this.margin_end = 12;
    this.margin_top = 6;
    this.margin_bottom = 6;

    this.append(this.expander);
    this.append(this.label);
  }

  static {
    GObject.registerClass(this);
  }
}

function create_model_func(item) {
  if (item.children.length < 1) return null;
  const child_model = Gio.ListStore.new(TreeNode.$gtype);
  for (const child of item.children) {
    child_model.append(child);
  }
  return child_model;
}

factory.connect("setup", (_self, list_item) => {
  list_item.set_child(new TreeWidget());
});

factory.connect("bind", (_self, list_item) => {
  const list_row = list_item.get_item();
  const widget = list_item.get_child();
  const item = list_row.get_item();

  widget.expander.set_list_row(list_row);
  widget.label.set_label(item.title);
});

const root_model = new TreeNode("Root", [
  new TreeNode("Child 1", [
    new TreeNode("Child 1.1", []),
    new TreeNode("Child 1.2", []),
  ]),
  new TreeNode("Child 2", [
    new TreeNode("Child 2.1", []),
    new TreeNode("Child 2.2", []),
    new TreeNode("Child 2.3", [new TreeNode("Child 3.1", [])]),
  ]),
]);

const tree_model = Gio.ListStore.new(TreeNode.$gtype);
tree_model.append(root_model);

const tree_list_model = Gtk.TreeListModel.new(
  tree_model,
  false,
  true,
  create_model_func,
);
tree_list_model.set_autoexpand(false);

const selection_model = new Gtk.NoSelection({ model: tree_list_model });

list_view.set_model(selection_model);
