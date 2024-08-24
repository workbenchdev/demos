import Gtk from "gi://Gtk?version=4.0";

const basic_label = workbench.builder.get_object<Gtk.Label>("basic_label");

basic_label.add_css_class("css_text");
