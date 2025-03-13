import Adw from "gi://Adw";
import Gdk from "gi://Gdk?version=4.0";
import Gio from "gi://Gio";
import GLib from "gi://GLib?version=2.0";
import Gtk from "gi://Gtk?version=4.0";
import Xdp from "gi://Xdp?version=1.0";
import XdpGtk from "gi://XdpGtk4";

Gio._promisify(
  Xdp.Portal.prototype,
  "get_user_information",
  "get_user_information_finish",
);

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);

const revealer = workbench.builder.get_object<Gtk.Revealer>("revealer");
const button = workbench.builder.get_object<Gtk.Button>("button");
const avatar = workbench.builder.get_object<Adw.Avatar>("avatar");
const entry = workbench.builder.get_object<Adw.EntryRow>("entry");
const username = workbench.builder.get_object<Gtk.Label>("username");
const display = workbench.builder.get_object<Gtk.Label>("name");

async function onClicked() {
  const reason = entry.get_text();
  // @ts-expect-error this function's isn't detected as `async` yet.
  const result = await portal.get_user_information(
    parent,
    reason,
    null,
    null,
  ) as GLib.Variant;

  /*
  result is a GVariant dictionary containing the following fields
  id (s): the user ID
  name (s): the users real name
  image (s): the uri of an image file for the users avatar picture
  */

  const user_info = result.deepUnpack();
  const id = user_info["id"].deepUnpack();
  const name = user_info["name"].deepUnpack();
  const uri = user_info["image"].deepUnpack();
  const file = Gio.File.new_for_uri(uri);
  const texture = Gdk.Texture.new_from_file(file);

  username.label = id;
  display.label = name;
  avatar.set_custom_image(texture);
  revealer.reveal_child = true;

  entry.set_text("");
  console.log("Information retrieved");
}

button.connect("clicked", () => {
  onClicked().catch(console.error);
});
