import GObject from "gi://GObject";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const drop_down = workbench.builder.get_object<Gtk.DropDown>("drop_down");
const advanced_drop_down = workbench.builder.get_object<Gtk.DropDown>("advanced_drop_down");

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

interface KeyValuePairConstructorProps {
  key: string;
  value: string;
}

class KeyValuePair extends GObject.Object {
  static {
    GObject.registerClass(
      {
        Properties: {
          key: GObject.ParamSpec.string(
            "key",
            null,
            null,
            GObject.ParamFlags.READWRITE,
            "",
          ),
          value: GObject.ParamSpec.string(
            "value",
            "Value",
            "Value",
            GObject.ParamFlags.READWRITE,
            "",
          ),
        },
      },
      this,
    );
  }

  key!: string;
  value!: string;

  constructor(props?: Partial<KeyValuePairConstructorProps>) {
    // @ts-expect-error incorrect types see https://github.com/gjsify/ts-for-gir/issues/191
    super(props);
  }
}

const model = new Gio.ListStore({ item_type: KeyValuePair.$gtype });

model.splice(0, 0, [
  new KeyValuePair({ key: "lion", value: "Lion" }),
  new KeyValuePair({ key: "tiger", value: "Tiger" }),
  new KeyValuePair({ key: "leopard", value: "Leopard" }),
  new KeyValuePair({ key: "elephant", value: "Elephant" }),
  new KeyValuePair({ key: "giraffe", value: "Giraffe" }),
  new KeyValuePair({ key: "cheetah", value: "Cheetah" }),
  new KeyValuePair({ key: "zebra", value: "Zebra" }),
  new KeyValuePair({ key: "panda", value: "Panda" }),
  new KeyValuePair({ key: "koala", value: "Koala" }),
  new KeyValuePair({ key: "crocodile", value: "Crocodile" }),
  new KeyValuePair({ key: "hippo", value: "Hippopotamus" }),
  new KeyValuePair({ key: "monkey", value: "Monkey" }),
  new KeyValuePair({ key: "rhino", value: "Rhinoceros" }),
  new KeyValuePair({ key: "kangaroo", value: "Kangaroo" }),
  new KeyValuePair({ key: "dolphin", value: "Dolphin" }),
]);

const list_store_expression = Gtk.PropertyExpression.new(
  KeyValuePair.$gtype,
  null,
  "value",
);

advanced_drop_down.expression = list_store_expression;
advanced_drop_down.model = model;

advanced_drop_down.connect("notify::selected-item", () => {
  const selected_item = advanced_drop_down.selected_item as KeyValuePair;
  if (selected_item) {
    console.log(selected_item.key);
  }
});
