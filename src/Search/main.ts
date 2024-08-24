import Adw from "gi://Adw";
import Gtk from "gi://Gtk?version=4.0";

const button = workbench.builder.get_object("button_search");
const searchbar = workbench.builder.get_object<Gtk.SearchBar>("searchbar");
const searchentry = workbench.builder.get_object<Gtk.SearchEntry>(
  "searchentry",
);
const stack = workbench.builder.get_object<Gtk.Stack>("stack");
const main_page = workbench.builder.get_object<Adw.StatusPage>("main_page");
const search_page = workbench.builder.get_object<Gtk.ScrolledWindow>(
  "search_page",
);
const status_page = workbench.builder.get_object<Adw.StatusPage>("status_page");
const listbox = workbench.builder.get_object<Gtk.ListBox>("listbox");

button.connect("clicked", () => {
  searchbar.search_mode_enabled = !searchbar.search_mode_enabled;
});

searchbar.connect("notify::search-mode-enabled", () => {
  if (searchbar.search_mode_enabled) {
    stack.visible_child = search_page;
  } else {
    stack.visible_child = main_page;
  }
});

const fruits = [
  "Apple 🍎️",
  "Orange 🍊️",
  "Pear 🍐️",
  "Watermelon 🍉️",
  "Melon 🍈️",
  "Pineapple 🍍️",
  "Grape 🍇️",
  "Kiwi 🥝️",
  "Banana 🍌️",
  "Peach 🍑️",
  "Cherry 🍒️",
  "Strawberry 🍓️",
  "Blueberry 🫐️",
  "Mango 🥭️",
  "Bell Pepper 🫑️",
];

fruits.forEach((name) => {
  const row = new Adw.ActionRow({
    title: name,
  });
  listbox.append(row);
});

let results_count;

function filter(row) {
  const re = new RegExp(searchentry.text, "i");
  const match = re.test(row.title);
  if (match) results_count++;
  return match;
}

listbox.set_filter_func(filter);

searchentry.connect("search-changed", () => {
  results_count = -1;
  listbox.invalidate_filter();
  if (results_count === -1) stack.visible_child = status_page;
  else if (searchbar.search_mode_enabled) stack.visible_child = search_page;
});
