import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";
import Xdp from "gi://Xdp";
import XdpGtk from "gi://XdpGtk4";

Gio._promisify(
  Xdp.Portal.prototype,
  "location_monitor_start",
  "location_monitor_start_finish",
);

const portal = new Xdp.Portal();
const parent = XdpGtk.parent_new_gtk(workbench.window);

const revealer = workbench.builder.get_object<Gtk.Revealer>("revealer");
const start = workbench.builder.get_object<Gtk.Button>("start");
const close = workbench.builder.get_object<Gtk.Button>("close");
const distance_threshold = workbench.builder.get_object<Adw.SpinRow>(
  "distance_threshold",
);
const time_threshold = workbench.builder.get_object<Adw.SpinRow>(
  "time_threshold",
);
const accuracy_button = workbench.builder.get_object<Adw.ComboRow>(
  "accuracy_button",
);

const latitude_label = workbench.builder.get_object<Gtk.Label>("latitude");
const longitude_label = workbench.builder.get_object<Gtk.Label>("longitude");
const accuracy_label = workbench.builder.get_object<Gtk.Label>("accuracy");
const altitude_label = workbench.builder.get_object<Gtk.Label>("altitude");
const speed_label = workbench.builder.get_object<Gtk.Label>("speed");
const heading_label = workbench.builder.get_object<Gtk.Label>("heading");
const description_label = workbench.builder.get_object<Gtk.Label>(
  "description",
);
const timestamp_label = workbench.builder.get_object<Gtk.Label>("timestamp");

let locationAccuracy = Xdp.LocationAccuracy.EXACT;
let distanceThresholdValue = distance_threshold.value;
let timeThresholdValue = time_threshold.value;

time_threshold.connect("notify::value", () => {
  portal.location_monitor_stop();
  revealer.reveal_child = false;
  timeThresholdValue = time_threshold.value;
  console.log("Time threshold changed");
  startSession();
});

distance_threshold.connect("notify::value", () => {
  portal.location_monitor_stop();
  revealer.reveal_child = false;
  distanceThresholdValue = distance_threshold.value;
  console.log("Distance threshold changed");
  startSession();
});

accuracy_button.connect("notify::selected-item", () => {
  console.log("Accuracy changed");
  portal.location_monitor_stop();
  revealer.reveal_child = false;
  const accuracy_flag = (accuracy_button.selected_item as Gtk.StringObject)
    .get_string();
  locationAccuracy = Xdp.LocationAccuracy[accuracy_flag];
  startSession();
});

async function startSession() {
  start.sensitive = false;
  close.sensitive = true;
  // @ts-expect-error undetected async function
  const result = await portal.location_monitor_start(
    parent,
    distanceThresholdValue,
    timeThresholdValue,
    locationAccuracy,
    Xdp.LocationMonitorFlags.NONE,
    null,
  ) as boolean;
  if (result === true) {
    console.log("Location access granted");
    revealer.reveal_child = true;
  } else {
    console.log("Error retrieving location");
  }
}

portal.connect(
  "location-updated",
  (
    _self,
    latitude,
    longitude,
    altitude,
    accuracy,
    speed,
    heading,
    description,
    timestamp_s,
  ) => {
    latitude_label.label = latitude.toString();
    longitude_label.label = longitude.toString();
    accuracy_label.label = accuracy.toString();
    altitude_label.label = altitude.toString();
    speed_label.label = speed.toString();
    heading_label.label = heading.toString();
    description_label.label = description.toString();

    const timestamp = new Date(timestamp_s * 1000); // Convert UNIX timestamp to milliseconds
    const formattedTimestamp = timestamp.toLocaleString(); // Convert timestamp to local date and time string
    timestamp_label.label = formattedTimestamp;
  },
);

start.connect("clicked", () => {
  startSession().catch(console.error);
});

close.connect("clicked", () => {
  start.sensitive = true;
  close.sensitive = false;
  portal.location_monitor_stop();
  revealer.reveal_child = false;
  console.log("Session closed");
});
