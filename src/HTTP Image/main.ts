import GLib from "gi://GLib";
import Gdk from "gi://Gdk?version=4.0";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";
import Soup from "gi://Soup";

// https://picsum.photos/
const IMAGE_URL = "https://picsum.photos/800";

Gio._promisify(
  Soup.Session.prototype,
  "send_and_read_async",
  "send_and_read_finish",
);

const image_bytes = await getImageBytes(IMAGE_URL);
const texture = Gdk.Texture.new_from_bytes(image_bytes);
workbench.builder.get_object<Gtk.Picture>("picture").set_paintable(texture);

async function getImageBytes(url) {
  const session = new Soup.Session();
  const message = new Soup.Message({
    method: "GET",
    uri: GLib.Uri.parse(url, GLib.UriFlags.NONE),
  });
  // @ts-expect-error undetected async function
  const bytes = await session.send_and_read_async(
    message,
    GLib.PRIORITY_DEFAULT,
    null,
  ) as GLib.Bytes;
  const status = message.get_status();
  if (status !== Soup.Status.OK) {
    throw new Error(`Got ${status}, ${message.reason_phrase}`);
  }
  return bytes;
}
