import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk?version=4.0";

const banner = workbench.builder.get_object<Adw.Banner>("banner");
const network_monitor = Gio.NetworkMonitor.get_default();
const level_bar = workbench.builder.get_object<Gtk.LevelBar>("level_bar");

function setNetworkStatus() {
  banner.revealed = network_monitor.network_metered;
  level_bar.value = network_monitor.connectivity;
}

setNetworkStatus();
network_monitor.connect("network-changed", () => {
  setNetworkStatus();
});

banner.connect("button-clicked", () => {
  banner.revealed = false;
});
