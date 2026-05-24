void on_closed (Gtk.Popover popover) {
    message (@"$(popover.name) closed.");
}

public void main () {
    string[] popover_ids = { "plain_popover", "popover_menu" };

    foreach (string id in popover_ids) {
        var popover = (Gtk.Popover) workbench.builder.get_object (id);
        popover.closed.connect (on_closed);
    }
}
