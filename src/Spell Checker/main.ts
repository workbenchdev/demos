import Gtk from "gi://Gtk?version=4.0";
import GtkSource from "gi://GtkSource";
import Spelling from "gi://Spelling";

GtkSource.init();

const buffer = workbench.builder.get_object<GtkSource.Buffer>("buffer");
const text_view = workbench.builder.get_object<Gtk.TextView>("text_view");

// Spell checking setup
const checker = Spelling.Checker.get_default();
checker.set_language("en_US"); // set to U.S English
const adapter = Spelling.TextBufferAdapter.new(buffer, checker);
const extra_menu = adapter.get_menu_model();

text_view.set_extra_menu(extra_menu);
text_view.insert_action_group("spelling", adapter);

adapter.set_enabled(true);
