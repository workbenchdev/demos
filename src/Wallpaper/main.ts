import Gio from "gi://Gio";
import Xdp from "gi://Xdp";
import XdpGtk from "gi://XdpGtk4";
import Gtk from "gi://Gtk?version=4.0";

Gio._promisify(Xdp.Portal.prototype, "set_wallpaper", "set_wallpaper_finish");

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);
const button = workbench.builder.get_object<Gtk.Button>("button");

const uri = workbench.resolve("./wallpaper.png");

async function onClicked() {
  // @ts-expect-error this function is not correctly detected as async
  const success = await portal.set_wallpaper(
    parent,
    uri,
    Xdp.WallpaperFlags.PREVIEW |
      Xdp.WallpaperFlags.BACKGROUND |
      Xdp.WallpaperFlags.LOCKSCREEN,
    null,
  ) as boolean;

  if (success) {
    console.log("Wallpaper set successfully");
  } else {
    console.log("Could not set wallpaper");
  }
}

button.connect("clicked", () => {
  onClicked().catch(console.error);
});
