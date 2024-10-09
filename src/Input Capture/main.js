import Gio from "gi://Gio";
import Xdp from "gi://Xdp";
import XdpGtk from "gi://XdpGtk4";

Gio._promisify(
  Xdp.Portal.prototype,
  "create_input_capture_session",
  "create_input_capture_session_finish",
);

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);
const button = workbench.builder.get_object("button");

button.connect("clicked", () => {
  startInputCaptureSesion().catch(console.error);
});

async function startInputCaptureSesion() {
  const session = await portal.create_input_capture_session(
    parent,
    Xdp.InputCapability.KEYBOARD |
      Xdp.InputCapability.POINTER |
      Xdp.InputCapability.TOUCHSCREEN,
    null,
  );

  if (!session) {
    console.log("Permission denied");
    return;
  }

  const zones = session.get_zones();
  for (const zone of zones) {
    console.log(zone);
    //...
  }

  session.enable();
}
