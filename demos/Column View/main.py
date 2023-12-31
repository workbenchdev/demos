import gi

gi.require_version("Gtk", "4.0")
from gi.repository import Gio, GObject, Gtk

import workbench


column_view = workbench.builder.get_object("column_view")
col1 = workbench.builder.get_object("col1")
col2 = workbench.builder.get_object("col2")
col3 = workbench.builder.get_object("col3")


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


def _on_factory_setup(factory, list_item):
    label = Gtk.Label()
    label.set_margin_top(12)
    label.set_margin_bottom(12)
    list_item.set_child(label)


def _on_factory_bind(factory, list_item, what):
    label_widget = list_item.get_child()
    book = list_item.get_item().get_item()
    label_widget.set_label(str(getattr(book, what)))


col1.get_factory().connect("setup", _on_factory_setup)
col1.get_factory().connect("bind", _on_factory_bind, "title")
col2.get_factory().connect("setup", _on_factory_setup)
col2.get_factory().connect("bind", _on_factory_bind, "author")
col3.get_factory().connect("setup", _on_factory_setup)
col3.get_factory().connect("bind", _on_factory_bind, "year")


# Custom Sorter is required because PyGObject doesn't currently support
# Gtk.Expression: https://gitlab.gnome.org/GNOME/pygobject/-/issues/356


def model_func(item):
    pass


def sort_title(object_a, object_b, data=None):
    a = object_a.title.lower()
    b = object_b.title.lower()
    return (a > b) - (a < b)


def sort_author(object_a, object_b, _data=None):
    a = object_a.author.lower()
    b = object_b.author.lower()
    return (a > b) - (a < b)


def sort_year(object_a, object_b, _data=None):
    a = int(object_a.year)
    b = int(object_b.year)
    return (a > b) - (a < b)


tree_model = Gtk.TreeListModel.new(data_model, False, True, model_func)
tree_sorter = Gtk.TreeListRowSorter.new(column_view.get_sorter())
sorter_model = Gtk.SortListModel(model=tree_model, sorter=tree_sorter)
selection = Gtk.SingleSelection.new(model=sorter_model)
column_view.set_model(model=selection)

col1.set_sorter(Gtk.CustomSorter.new(sort_title))
col2.set_sorter(Gtk.CustomSorter.new(sort_author))
col3.set_sorter(Gtk.CustomSorter.new(sort_year))
