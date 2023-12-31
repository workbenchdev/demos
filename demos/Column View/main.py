import gi

gi.require_version("Gtk", "4.0")
from gi.repository import Gio, GObject, Gtk

import workbench


class Book(GObject.Object):
    def __init__(self, title, author, year):
        super().__init__()

        self._title = title
        self._author = author
        self._year = year

    @GObject.Property(type=str)
    def title(self) -> str:
        return self._title

    @GObject.Property(type=str)
    def author(self) -> str:
        return self._author

    @GObject.Property(type=str)
    def year(self) -> str:
        return self._year


column_view = workbench.builder.get_object("column_view")
col1 = workbench.builder.get_object("col1")
col2 = workbench.builder.get_object("col2")
col3 = workbench.builder.get_object("col3")

books = {
    "Winds from Afar": ("Kenji Miyazawa", 1972),
    "Like Water for Chocolate": ("Laura Esquivel", 1989),
    "Works and Nights": ("Alejandra Pizarnik", 1965),
    "Understanding Analysis": ("Stephen Abbott", 2002),
    "The Timeless Way of Building": ("Cristopher Alexander", 1979),
    "Bitter": ("Akwaeke Emezi", 2022),
    "Saying Yes": ("Griselda Gambaro", 1981),
    "Itinerary of a Dramatist": ("Rodolfo Usigli", 1940),
}

# Create the data model
data_model = Gio.ListStore(item_type=Book)
for title, book_info in books.items():
    data_model.append(Book(title=title, author=book_info[0], year=book_info[1]))

col1.sorter = Gtk.StringSorter.new(
    expression=Gtk.PropertyExpression.new(Book, None, "title")
)
col2.sorter = Gtk.StringSorter.new(
    expression=Gtk.PropertyExpression.new(Book, None, "author")
)
col3.sorter = Gtk.StringSorter.new(
    expression=Gtk.PropertyExpression.new(Book, None, "year")
)


def _on_factory_setup(factory, list_item):
    label = Gtk.Label()
    label.set_margin_top(12)
    label.set_margin_bottom(12)
    list_item.set_child(label)


def _on_factory_bind_col1(factory, list_item, what):
    label = list_item.get_child()
    book = list_item.get_item()
    label.set_label(book.title)


def _on_factory_bind_col2(factory, list_item, what):
    label = list_item.get_child()
    book = list_item.get_item()
    label.set_label(book.author)


def _on_factory_bind_col3(factory, list_item, what):
    label = list_item.get_child()
    book = list_item.get_item()
    label.set_label(book.year)


# Col 1
col1_factory: Gtk.SignalListItemFactory = col1.get_factory()
col1_factory.connect("setup", _on_factory_setup)
col1_factory.connect("bind", _on_factory_bind_col1)

# Col 2
col2_factory: Gtk.SignalListItemFactory = col2.get_factory()
col2_factory.connect("setup", _on_factory_setup)
col2_factory.connect("bind", _on_factory_bind_col2)

# Col 3
col3_factory: Gtk.SignalListItemFactory = col3.get_factory()
col3_factory.connect("setup", _on_factory_setup)
col3_factory.connect("bind", _on_factory_bind_col3)

sort_model = Gtk.SortListModel.new(data_model, column_view.sorter)
column_view.set_model(Gtk.SingleSelection(model=sort_model))

