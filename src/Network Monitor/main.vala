#! /usr/bin/env -S vala workbench.vala --pkg libadwaita-1

void set_network_status (Adw.Banner banner, NetworkMonitor network_monitor, Gtk.LevelBar level_bar) {
    double connectivity_value = 0.0;

    switch (network_monitor.connectivity) {
    case NetworkConnectivity.LOCAL:
        connectivity_value = 1;
        break;
    case NetworkConnectivity.LIMITED:
        connectivity_value = 2;
        break;
    case NetworkConnectivity.PORTAL:
        connectivity_value = 3;
        break;
    case NetworkConnectivity.FULL:
        connectivity_value = 4;
        break;
    }

    banner.revealed = network_monitor.network_metered;
    level_bar.value = connectivity_value;
}

public void main () {
    var banner = (Adw.Banner) workbench.builder.get_object ("banner");
    NetworkMonitor network_monitor = NetworkMonitor.get_default ();
    var level_bar = (Gtk.LevelBar) workbench.builder.get_object ("level_bar");

    set_network_status (banner, network_monitor, level_bar);
    network_monitor.network_changed.connect (() => {
        set_network_status (banner, network_monitor, level_bar);
    });
    banner.button_clicked.connect (() => {
        banner.revealed = false;
    });
}
