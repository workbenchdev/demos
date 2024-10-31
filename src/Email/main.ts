import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";
import Xdp from "gi://Xdp";
import XdpGtk from "gi://XdpGtk4";

Gio._promisify(Xdp.Portal.prototype, "compose_email", "compose_email_finish");

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);

const button = workbench.builder.get_object<Gtk.Button>("button");
const entry = workbench.builder.get_object<Gtk.Entry>("entry");

async function onClicked() {
  const email_address = entry.get_text();

  // @ts-expect-error undetected async
  const success = await portal.compose_email(
    parent,
    [email_address], // addresses
    null, // cc
    null, // bcc
    "Email from Workbench", // subject
    "Hello World!", // body
    null, // attachments
    Xdp.EmailFlags.NONE, // flags
    null, // cancellable
  ) as boolean;

  if (success) {
    console.log("Success");
  } else {
    console.log("Failure, verify that you have an email application.");
  }
}

button.connect("clicked", () => {
  onClicked().catch(console.error);
});
