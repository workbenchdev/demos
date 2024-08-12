import Gtk from "gi://Gtk?version=4.0";

const button_ids = [
  "regular",
  "flat",
  "suggested",
  "destructive",
  "custom",
  "disabled",
  "circular-plus",
  "circular-minus",
  "pill",
  "osd-left",
  "osd-right",
];

for (const id of button_ids) {
  const button = workbench.builder.get_object<Gtk.Button>(id);
  button.connect("clicked", onClicked);
}

function onClicked(button) {
  console.log(`${button.name} clicked`);
}
