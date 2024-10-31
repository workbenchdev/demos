import Adw from "gi://Adw";
import GObject from "gi://GObject";
import Gtk from "gi://Gtk?version=4.0";

const drop_down = workbench.builder.get_object<Adw.ComboRow>("drop_down");

drop_down.connect("notify::selected-item", () => {
  const selected_item = drop_down.selected_item as Gtk.StringObject;
  const selected_string = selected_item.get_string();
  console.log(selected_string);
});

const expression = Gtk.ClosureExpression.new(
  GObject.TYPE_STRING,
  (obj) => obj.string,
  null,
);
drop_down.expression = expression;
