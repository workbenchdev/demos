import Gtk from "gi://Gtk?version=4.0";

const emoji_chooser = workbench.builder.get_object<Gtk.EmojiChooser>("emoji_chooser");
const button = workbench.builder.get_object<Gtk.Button>("button");

emoji_chooser.connect("emoji-picked", (_self, emoji) => {
  button.label = emoji;
});
