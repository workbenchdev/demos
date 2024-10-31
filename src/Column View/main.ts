import GObject from "gi://GObject";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const column_view = workbench.builder.get_object<Gtk.ColumnView>("column_view");
const col1 = workbench.builder.get_object<Gtk.ColumnViewColumn>("col1");
const col2 = workbench.builder.get_object<Gtk.ColumnViewColumn>("col2");
const col3 = workbench.builder.get_object<Gtk.ColumnViewColumn>("col3");

interface BookConstructorProps {
  title: string;
  author: string;
  year: number;
}

// Define our class for our custom model
const Book = GObject.registerClass(
  {
    Properties: {
      title: GObject.ParamSpec.string(
        "title",
        null,
        null,
        GObject.ParamFlags.READWRITE,
        "",
      ),
      author: GObject.ParamSpec.string(
        "author",
        null,
        null,
        GObject.ParamFlags.READWRITE,
        "",
      ),
      year: GObject.ParamSpec.int64(
        "year",
        null,
        null,
        GObject.ParamFlags.READWRITE,
        Number.MIN_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER,
        0,
      ),
    },
  },
  class Book extends GObject.Object {
    constructor(props?: Partial<BookConstructorProps>) {
      // @ts-expect-error incorrect types: https://github.com/gjsify/ts-for-gir/issues/191
      super(props);
    }
  },
);

// Create the model
const data_model = new Gio.ListStore({ item_type: Book.$gtype });
data_model.splice(0, 0, [
  new Book({
    title: "Winds from Afar",
    author: "Kenji Miyazawa",
    year: 1972,
  }),
  new Book({
    title: "Like Water for Chocolate",
    author: "Laura Esquivel",
    year: 1989,
  }),
  new Book({
    title: "Works and Nights",
    author: "Alejandra Pizarnik",
    year: 1965,
  }),
  new Book({
    title: "Understading Analysis",
    author: "Stephen Abbott",
    year: 2002,
  }),
  new Book({
    title: "The Timeless Way of Building",
    author: "Cristopher Alexander",
    year: 1979,
  }),
  new Book({
    title: "Bitter",
    author: "Akwaeke Emezi",
    year: 2022,
  }),
  new Book({
    title: "Saying Yes",
    author: "Griselda Gambaro",
    year: 1981,
  }),
  new Book({
    title: "Itinerary of a Dramatist",
    author: "Rodolfo Usigli",
    year: 1940,
  }),
]);

col1.sorter = new Gtk.StringSorter({
  expression: Gtk.PropertyExpression.new(Book.$gtype, null, "title"),
});

col2.sorter = new Gtk.StringSorter({
  expression: Gtk.PropertyExpression.new(Book.$gtype, null, "author"),
});

col3.sorter = new Gtk.NumericSorter({
  expression: Gtk.PropertyExpression.new(Book.$gtype, null, "year"),
});

// View
// Column 1
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
  label_widget.label = model_item.title;
});

// Column 2
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
  label_widget.label = model_item.author;
});

// Column 3
const factory_col3 = col3.factory;
factory_col3.connect("setup", (_self, list_item) => {
  const label = new Gtk.Label({
    margin_start: 12,
    margin_end: 12,
  });
  list_item.set_child(label);
});
factory_col3.connect("bind", (_self, list_item) => {
  const label_widget = list_item.get_child();
  const model_item = list_item.get_item();
  label_widget.label = model_item.year.toString();
});

const sort_model = new Gtk.SortListModel({
  model: data_model,
  sorter: column_view.sorter,
});

column_view.model = new Gtk.SingleSelection({
  model: sort_model,
});
